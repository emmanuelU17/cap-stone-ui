import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, PageChange, ProductResponse, TableContent} from "../../../shared-util";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {DynamicTableComponent} from "../../util/dynamictable/dynamic-table.component";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {DirectiveModule} from "../../../../directive/directive.module";
import {UpdateCategoryService} from "./update-category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Page} from "../../../../global-utils";
import {CategoryService} from "../category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../product/product.service";
import {ToastService} from "../../../../shared-comp/toast/toast.service";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    DynamicTableComponent,
    MatButtonModule,
    DirectiveModule,
    MatDialogModule
  ],
  templateUrl: 'update-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCategoryComponent implements OnInit {

  private readonly updateCategoryService = inject(UpdateCategoryService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';

  data: CategoryResponse | undefined = this.categoryService.categories
    .find(c => c.category_id === this.uuid);

  // Table
  thead: Array<keyof ProductResponse> = ['image', 'product_id', 'name', 'desc', 'currency', 'price'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.productService.currency$.pipe(
    switchMap((currency) => this.updateCategoryService
      .allProductsByCategory(this.uuid, 0, 20, currency).pipe(
        map((arr: Page<ProductResponse>) => ({ state: 'LOADED', data: arr })),
        startWith({state: 'LOADING'}),
        catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
      )
    )
  );

  reactiveForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.reactiveForm.controls['name'].setValue(this.data.category);
      this.reactiveForm.controls['visible'].setValue(this.data.visible);
    }
  }

  /** Return back to parent */
  returnToCategoryComponent(): void {
    this.router.navigate(['/admin/dashboard/category']);
  }

  /** Clear input field */
  clear(): void {
    this.reactiveForm.reset();
    this.returnToCategoryComponent();
  }

  /** Onclick of product title in table, routes client to update product component */
  eventEmitter(content: TableContent<ProductResponse>): void {
    this.router.navigate([`/admin/dashboard/product/${content.data.product_id}`]);
  }

  /**
   * Makes call to server on change of page or page size
   * */
  pageChange(page: PageChange): void {
    this.data$ = this.productService.currency$
      .pipe(
        switchMap((currency) => this.updateCategoryService
          .allProductsByCategory(this.uuid, page.page, page.size, currency)
          .pipe(map((res) => ({ state: 'LOADED', data: res })))
        ),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
      );
  }

  /** Updates category */
  update(): Observable<number> {
    const name = this.reactiveForm.controls['name'].value;
    const visible = this.reactiveForm.controls['visible'].value;

    if (!name || visible === null) {
      return of(0);
    }

    return this.updateCategoryService
      .updateCategory({category_id: this.uuid, name: name, visible: visible})
      .pipe(
        switchMap((status: number): Observable<number> => {
          const res = of(status);

          // Update ProductResponse and CategoryResponse array
          const product$ = this.productService.currency$
            .pipe(switchMap((currency) =>
              this.productService.allProducts(0, 20, currency))
            );
          const categories$ = this.categoryService.allCategories();

          // combineLatest as we need both responses
          return combineLatest([product$, categories$]).pipe(switchMap(() => res));
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error.message);
          return of(err.status);
        })
      );
  }

}
