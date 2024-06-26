import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DynamicTableComponent } from '@/app/admin-front/dashboard/util/dynamictable/dynamic-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { ProductService } from '@/app/admin-front/dashboard/product/product.service';
import { Router, RouterLink } from '@angular/router';
import { TableContent } from '@/app/admin-front//shared-util';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteComponent } from '@/app/admin-front/dashboard/util/delete/delete.component';
import { ToastService } from '@/app/shared-comp/toast/toast.service';

interface CategoryResponseMapper {
  index: number;
  categoryId: number;
  name: string;
  visible: boolean;
  delete: string;
}

@Component({
  selector: 'app-category-impl',
  standalone: true,
  imports: [DynamicTableComponent, MatDialogModule, RouterLink, AsyncPipe],
  template: `
    <div class="h-full py-0 px-2.5">
      <div class="py-2.5 px-0 flex">
        <h1
          class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]"
        >
          categories
        </h1>
        <a routerLink="new" class="ml-1 bg-transparent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-[var(--app-theme)]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </a>
      </div>

      @if (data$ | async; as data) {
        <div class="px-0">
          <app-dynamic-table
            [tHead]="tHead"
            [data]="data"
            (eventEmitter)="infoFromTableComponent($event)"
          ></app-dynamic-table>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryImplComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly data$ = this.categoryService.categories$.pipe(
    map((arr) =>
      arr.map((obj, index) => ({
        index: index + 1,
        categoryId: obj.category_id,
        name: obj.name,
        visible: obj.visible,
        delete: '',
      })),
    ),
  );

  readonly tHead: Array<keyof CategoryResponseMapper> = [
    'index',
    'name',
    'visible',
    'delete',
  ];

  infoFromTableComponent(content: TableContent<CategoryResponseMapper>): void {
    switch (content.key) {
      case 'view':
        break;
      case 'edit':
        this.router.navigate([
          `/admin/dashboard/category/${content.data.categoryId}`,
        ]);
        break;
      case 'delete':
        const obs = this.categoryService
          .deleteCategory(content.data.categoryId)
          .pipe(
            switchMap((status: number) =>
              this.productService.action(
                status,
                this.categoryService.allCategories(),
              ),
            ),
            catchError((err: HttpErrorResponse) =>
              of({ status: err.status, message: err.error.message }),
            ),
          );

        // Open modal
        this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: content.data.name,
            asyncButton: obs,
          },
        });

        break;
      default:
        this.toastService.toastMessage('invalid key chosen');
    }
  }
}
