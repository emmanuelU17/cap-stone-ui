import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductResponse, TableContent} from "../../shared-util";
import {Page} from "../../../global-utils";
import {catchError, delay, map, Observable, of, startWith} from "rxjs";
import {ProductService} from "./product.service";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteComponent} from "../delete/delete.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  private productService: ProductService = inject(ProductService);
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private dialog: MatDialog = inject(MatDialog);

  // Table details
  thead: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price', 'action'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.productService._products$.pipe(
    map((res: Page<ProductResponse>) => ({ state: 'LOADED', data: res })),
    startWith({ state: 'LOADING' }),
    catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
  );

  /**
   * Displays UpdateProduct component based on the product clicked from DynamicTable
   * @param content of custom interface TableContent
   * @return void
   * */
  infoFromTableComponent(content: TableContent<ProductResponse>): void {
    console.log('Key ', content.key)
    switch (content.key) {
      case 'product':
        this.router.navigate([`/admin/dashboard/product/${content.data.id}`]);
        break;
      case 'delete':
        // TODO
        const dialogRef = this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: content.data.name,
            obs: of(200).pipe(delay(5000))
          }
        });

        break;
      default :
        console.error('Invalid key chosen');
    }
  }

  /** Makes a call to our server. param name is the products id */
  deleteProduct(id: string): Observable<number> {
    return this.productService.deleteProduct(id);
  }

}
