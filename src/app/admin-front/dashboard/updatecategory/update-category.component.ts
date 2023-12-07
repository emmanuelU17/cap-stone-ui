import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, PageChange, ProductResponse, TableContent} from "../../shared-util";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {DirectiveModule} from "../../../directive/directive.module";
import {UpdateCategoryService} from "./update-category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Page} from "../../../global-utils";
import {CategoryService} from "../category/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../product/product.service";
import {ToastService} from "../../../shared-comp/toast/toast.service";
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
  template: `
    <ng-container *ngIf="data; else error">
      <!-- Title-container -->
      <div class="w-full flex py-2.5 px-0 gap-2.5">
        <button type="button" class="md:px-2.5 border-[var(--border-outline)] border"
                (click)="returnToCategoryComponent()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
          </svg>
        </button>
        <h1 class="text-base capitalize">Updating {{ data.category }}</h1>
      </div>

      <div class="w-full h-full grid gap-2.5 lg:grid-cols-2">

        <!-- Category Column -->
        <div class="p-2">
          <div class="mb-2">
            <h1 class="capitalize">details</h1>
          </div>

          <form class="w-full flex flex-col gap-2.5" [formGroup]="reactiveForm">

            <!-- Input box -->
            <div
              class="p-6 flex flex-col gap-2.5 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size capitalize">name <span [style]="'color: red'">*</span></h4>
              <input
                formControlName="name"
                placeholder="category name"
                type="text"
                class="p-2.5 w-full flex-1 inline rounded-sm border border-solid border-[var(--border-outline)]"
              />
            </div>

            <!-- Radio -->
            <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size capitalize">visibility (include in store front) <span
                [style]="'color: red'">*</span></h4>
              <mat-radio-group aria-label="Select an option" formControlName="visible">
                <mat-radio-button [value]="false" [checked]="!data.visible">false</mat-radio-button>
                <mat-radio-button [value]="true" [checked]="data.visible">true</mat-radio-button>
              </mat-radio-group>
            </div>

            <!-- Button container -->
            <div class="p-2.5 px-1.5 flex justify-between">
              <button mat-stroked-button color="warn" [style.border-color]="'red'" type="button" (click)="clear()">
                Cancel
              </button>
              <button
                type="submit"
                class="capitalize text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
                [disabled]="!reactiveForm.valid"
                [style]="{ 'background-color': reactiveForm.valid ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
                [asyncButton]="update()"
              >update
              </button>
            </div>

          </form>
        </div>

        <!-- Product Table Column -->
        <div class="max-h-3/5 overflow-auto flex-1 p-2 ">

          <div class="flex flex-col h-full w-full py-0">
            <div class="mb-2">
              <h1 class="capitalize">associated products</h1>
            </div>

            <div class="flex-1 rounded-md border border-[var(--active)] border-solid bg-[var(--white)]"
                 *ngIf="data$ | async as data" [ngSwitch]="data.state">
              <ng-container *ngSwitchCase="'LOADING'">
                <div class="h-full p-20 flex justify-center items-center">
                  <h1 class="capitalize text-[var(--app-theme-hover)]">
                    loading...
                  </h1>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'ERROR'">
                <div class="p-10 capitalize text-3xl text-red-500">
                  Error {{ data.error }}
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'LOADED'">
                <ng-container *ngIf="data.data">
                  <app-dynamic-table
                    [paginationTable]="true"
                    [detail]="true"
                    [pageData]="data.data"
                    [tHead]="thead"
                    (eventEmitter)="eventEmitter($event)"
                    (pageEmitter)="pageChange($event)"
                  ></app-dynamic-table>
                </ng-container>

              </ng-container>
            </div>
          </div>

        </div>

      </div>
    </ng-container>

    <ng-template #error>
      <div class="lg-scr p-10 text-3xl text-red-500">
        <button type="button" class="md:px-2.5 border-[var(--border-outline)] border"
                (click)="returnToCategoryComponent()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
          </svg>
        </button>
        An error occurred
      </div>
    </ng-template>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCategoryComponent implements OnInit {

  private readonly updateCategoryService: UpdateCategoryService = inject(UpdateCategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);

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
          const categories$ = this.categoryService.fetchCategories();

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
