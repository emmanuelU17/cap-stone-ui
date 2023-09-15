import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductResponse, TableContent} from "../../shared-util";
import {Page} from "../../../global-utils";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {ProductService} from "./product.service";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  private productService: ProductService = inject(ProductService);
  private router: Router = inject(Router);

  // Table details
  thead: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price'];
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
    switch (content.key) {
      case 'product':
        this.router.navigate([`/admin/dashboard/product/${content.data.id}`]);
        break;
      case 'delete':
        // TODO
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
