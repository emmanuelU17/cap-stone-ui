import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, TableContent} from "../../shared-util";
import {CategoryService} from "./category.service";
import {catchError, combineLatest, map, Observable, of, switchMap} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {Router} from "@angular/router";
import {ProductService} from "../product/product.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteComponent} from "../delete/delete.component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-category',
  standalone: true,
  template: `
    <div class="h-full py-0 px-2.5">
      <div class="py-2.5 px-0 flex">
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">categories</h1>
        <button type="button" class="ml-1 bg-transparent" (click)="routeToNewCategory()">
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

      <div class="px-0" *ngIf="data$ | async as data">
        <app-dynamic-table
          [detail]="false"
          [tHead]="tHead"
          [data]="data"
          (eventEmitter)="infoFromTableComponent($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);

  data$: Observable<CategoryResponse[]> = this.categoryService.categories$;
  tHead: Array<keyof CategoryResponse> = ['category_id', 'category', 'created_at', 'modified_at', 'visible', 'action'];

  routeToNewCategory = (): void => {
    this.router.navigate(['/admin/dashboard/new-category']);
  }

  infoFromTableComponent(content: TableContent<CategoryResponse>): void {
    switch (content.key) {
      case 'view':
        break;
      case 'edit':
        this.router.navigate([`/admin/dashboard/category/${content.data.category_id}`]);
        break;
      case 'delete':
        const obs: Observable<{ status: number, message: string }> = this.categoryService
          .deleteCategory(content.data.category_id)
          .pipe(
            switchMap((status: number) => {
              // Refresh Category and Product Array
              const products$ = this.productService.currency$
                .pipe(switchMap((currency) =>
                  this.productService.allProducts(0, 20, currency))
                );
              const categories$ = this.categoryService.fetchCategories();

              return of(status).pipe(
                switchMap((num: number) =>
                  combineLatest([products$, categories$])
                    .pipe(
                      map(() => ({ status: num, message: 'deleted!' }))
                    )
                )
              );
            }),
            catchError((err: HttpErrorResponse) => of({ status: err.status, message: err.error.message }))
          );

        // Open modal
        this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: content.data.category,
            asyncButton: obs
          }
        });

        break;
      default :
        console.error('Invalid key chosen');
    }
  }

}
