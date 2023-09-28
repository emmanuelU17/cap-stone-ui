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
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);

  data$: Observable<CategoryResponse[]> = this.categoryService._categories$;
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
              const products$ = this.productService.fetchAllProducts();
              const collections$ = this.categoryService.fetchCategories();

              return of(status).pipe(
                switchMap((num: number) =>
                  combineLatest([products$, collections$])
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
