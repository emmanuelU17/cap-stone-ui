import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpdateCollectionService} from "./update-collection.service";
import {NavigationService} from "../../../service/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CollectionService} from "../collection/collection.service";
import {CollectionResponse, ProductResponse} from "../../shared-util";
import {catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {Page} from "../../../global-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";

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
    DirectiveModule
  ],
  templateUrl: './update-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCollectionComponent implements OnInit {
  private updateCollectionService: UpdateCollectionService = inject(UpdateCollectionService);
  private collectionService: CollectionService = inject(CollectionService);
  private navigationService: NavigationService = inject(NavigationService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';
  data: CollectionResponse | undefined = this.collectionService.collections
    .find(c => c.id === this.uuid)

  // Table
  thead: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.updateCollectionService.allProductsByCollection(this.uuid)
    .pipe(
      map((arr: Page<ProductResponse>) => ({state: 'LOADED', data: arr})),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
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
    this.navigationService.navigateBack('/admin/dashboard/collection');
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
      .updateCollection({id: this.uuid, name: name, visible: visible})
      .pipe(
        switchMap((status: number) => {
          const res = of(status);

          // Return status code is response is an error
          if (!(status >= 200 && status < 300)) {
            return res;
          }

          // Update CategoryResponse array
          return this.collectionService.fetchCollections().pipe(switchMap(() => res));
        })
      );
  }

}
