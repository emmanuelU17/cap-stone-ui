import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageChange, ProductResponse, TableContent} from "../../shared-util";
import {Page} from "../../../global-utils";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {ProductService} from "./product.service";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteComponent} from "../delete/delete.component";
import {CollectionService} from "../collection/collection.service";
import {CategoryService} from "../category/category.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  template: `
    <div class="flex flex-col h-full py-0">
      <div class="px-0 py-2.5 flex items-center">
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">products</h1>
        <button type="button" class="ml-1" (click)="routeToNewProduct()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-[var(--app-theme)]"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      <div class="flex-1" *ngIf="data$ | async as data" [ngSwitch]="data.state">
        <ng-container *ngSwitchCase="'LOADING'">
          <div class="lg-scr h-full p-20 flex justify-center items-center">
            <h1 class="cx-font-size capitalize text-[var(--app-theme-hover)]">
              loading...
            </h1>
          </div>
        </ng-container>
        <ng-container *ngSwitchCase="'ERROR'">
          <div class="lg-scr mg-top p-10 capitalize text-3xl text-red-500">
            Error {{ data.error }}
          </div>
        </ng-container >
        <ng-container *ngSwitchCase="'LOADED'">
          <ng-container *ngIf="data.data">
            <app-dynamic-table
              [paginationTable]="true"
              [detail]="true"
              [pageData]="data.data"
              [tHead]="thead"
              (eventEmitter)="infoFromTableComponent($event)"
              (pageEmitter)="pageChange($event)"
            ></app-dynamic-table>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Table details
  thead: Array<keyof ProductResponse> = ['product_id', 'image', 'name', 'desc', 'currency', 'price', 'action'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.productService.currency$.pipe(
    switchMap(() => this.productService.products$.pipe(
      map((res: Page<ProductResponse>) => ({ state: 'LOADED', data: res })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
    ))
  );

  routeToNewProduct = (): void => {
    this.router.navigate(['/admin/dashboard/new-product']);
  }

  /**
   * Makes call to server on change of page or page size
   * */
  pageChange(page: PageChange): void {
    this.data$ = this.productService.currency$
      .pipe(
        switchMap((currency) => this.productService
          .allProducts(page.page, page.size, currency)
          .pipe(map((res: Page<ProductResponse>) => ({ state: 'LOADED', data: res })))
        ),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
      );
  }

  /**
   * Displays UpdateProduct component based on the product clicked from DynamicTable
   * @param content of custom interface TableContent
   * @return void
   * */
  infoFromTableComponent(content: TableContent<ProductResponse>): void {
    switch (content.key) {
      case 'product':{
        this.router.navigate([`/admin/dashboard/product/${content.data.product_id}`]);
        break;
      }

      case 'delete': {
        const obs: Observable<{ status: number, message: string }> = this.productService
          .deleteProduct(content.data.product_id)
          .pipe(
            switchMap((status: number) => {
              // Refresh Product, Category and Collection array
              const products$ = this.productService.currency$
                .pipe(switchMap((currency) =>
                  this.productService.allProducts(0, 20, currency))
                );
              const categories$ = this.categoryService.allCategories();
              const collections$ = this.collectionService.allCollections();

              return of(status).pipe(
                switchMap((num: number) =>
                  combineLatest([products$, categories$, collections$]).pipe(
                    map(() => ({ status: num, message: 'deleted!' }))
                  )
                )
              );
            }),
            catchError((err: HttpErrorResponse) => of({ status: err.status, message: err.error.message }))
          );

        this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: content.data.name,
            asyncButton: obs
          }
        });

        break;
      }

      default :
        console.error('Invalid key chosen');
    }
  }

}
