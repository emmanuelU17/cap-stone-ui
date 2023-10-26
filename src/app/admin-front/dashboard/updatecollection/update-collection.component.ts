import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateCollectionService} from "./update-collection.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CollectionService} from "../collection/collection.service";
import {CollectionResponse, ProductResponse, TableContent} from "../../shared-util";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {Page} from "../../../global-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";
import {ProductService} from "../product/product.service";
import {MatDialogModule} from "@angular/material/dialog";
import {ToastService} from "../../../service/toast/toast.service";

@Component({
  selector: 'app-update-collection',
  standalone: true,
  imports: [
    CommonModule,
    DynamicTableComponent,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    DirectiveModule,
    MatDialogModule
  ],
  templateUrl: './update-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCollectionComponent implements OnInit {

  private readonly updateCollectionService: UpdateCollectionService = inject(UpdateCollectionService);
  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';
  data: CollectionResponse | undefined = this.collectionService.collections
    .find(c => c.collection_id === this.uuid)

  // Table
  thead: Array<keyof ProductResponse> = ['image', 'product_id', 'name', 'desc', 'currency', 'price'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.productService.currency$.pipe(
    switchMap((currency) => this.updateCollectionService
      .allProductsByCollection(this.uuid, 0, 20, currency)
      .pipe(
        map((arr: Page<ProductResponse>) => ({state: 'LOADED', data: arr})),
        startWith({state: 'LOADING'}),
        catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
      )
    )
  );

  reactiveForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.reactiveForm.controls['name'].setValue(this.data.collection);
      this.reactiveForm.controls['visible'].setValue(this.data.visible);
    }
  }

  /** Return back to parent */
  returnToCollectionComponent(): void {
    this.router.navigate(['/admin/dashboard/collection']);
  }

  /** Onclick of product title in table, routes client to update product component */
  eventEmitter(content: TableContent<ProductResponse>): void {
    this.router.navigate([`/admin/dashboard/product/${content.data.product_id}`]);
  }

  /** Clear input field */
  clear(): void {
    this.reactiveForm.reset();
    this.returnToCollectionComponent();
  }

  /** Updates collection */
  update(): Observable<number> {
    const name = this.reactiveForm.controls['name'].value;
    const visible = this.reactiveForm.controls['visible'].value;

    if (!name || visible === null) {
      return of(0);
    }

    return this.updateCollection(name, visible);
  }

  private updateCollection(name: string, visible: boolean): Observable<number> {
    return this.updateCollectionService
      .updateCollection({collection_id: this.uuid, name: name, visible: visible})
      .pipe(
        switchMap((status: number) => {
          const res = of(status);

          // Update ProductResponse and CollectionResponse array
          const product$ = this.productService.currency$
            .pipe(switchMap((currency) =>
              this.productService.fetchAllProducts(0, 20, currency))
            );
          const collections$ = this.collectionService.fetchCollections();

          // combineLatest as we need both responses
          return combineLatest([product$, collections$]).pipe(switchMap(() => res));
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error.message);
          return of(err.status);
        })
      );
  }

}
