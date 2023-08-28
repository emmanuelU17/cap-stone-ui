import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductResponse, TableContent, UpdateProduct} from "../../shared-util";
import {Page} from "../../../../global-utils/global-utils";
import {Observable, tap} from "rxjs";
import {ProductService} from "./product.service";
import {UpdateProductComponent} from "../updateproduct/update-product.component";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, UpdateProductComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  currComponent: boolean = true;
  id: string = '';
  name: string = '';
  desc: string = '';
  price: number = 0;
  category: string = '';
  collection: string = '';

  columns: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price'];

  data$: Observable<Page<ProductResponse> | undefined>;

  constructor(private productService: ProductService) {
    this.data$ = this.productService._products$;
  }

  /**
   * Displays UpdateProduct component based on the product clicked from DynamicTable
   * @param content of custom interface TableContent
   * @return void
   * */
  infoFromTableComponent(content: TableContent<UpdateProduct>): void {
    this.id = content.data.id;
    this.name = content.data.name;
    this.desc = content.data.desc;
    this.price = content.data.price
    this.collection = content.data.collection;
    this.category = content.data.category;

    // Needed to fetch Product Detail before OnInit
    this.productService.setProductId(content.data.id);
    // Display update component
    this.currComponent = false;
  }

  /** Displays product.component.html based on info received from Child component (UpdateProduct Component) */
  displayProductContainer(bool: boolean): void {
    this.currComponent = bool;
  }

  /** Refreshes Product array after Product has been updated */
  refreshProducts(bool: boolean): void {
    if (!bool) {
      return;
    }
    this.data$ = this.productService.fetchAllProducts()
      .pipe(tap((value: Page<ProductResponse>): void => this.productService.setProducts(value)));
  }

  /** Makes a call to our server. param name is the products id */
  deleteProduct(id: string): Observable<number> {
    return this.productService.deleteProduct(id).pipe(
      tap((res: number): void => {
        if (res >= 200 && res < 300) {
          // this.toastService.createToast('successfully deleted product');
          this.refreshProducts(true);
        }
      })
    );
  }
}
