import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ProductDetail} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  HOST: string | undefined;

  private products$ = new BehaviorSubject<Product[]>([]);
  _products$: Observable<Product[]> = this.products$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /**
   * Returns a Page of Products
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * */
  fetchProducts(page: number = 0, size: number = 18): Observable<Product[]> {
    const url: string = `${this.HOST}api/v1/client/product`;
    return this.http.get<Page<Product>>(url, {
      params: {
        page: page,
        size: size
      },
      withCredentials: true
    }).pipe(
      map((page: Page<Product>): Product[] =>
        page.content === undefined || page.content === null ? [] : page.content)
    );
  }

  /**
   * Fetch ProductDetails based on Product id
   * @param uuid is product id
   * @return Observable array of ProductDetails
   * */
  fetchProductDetails(uuid: string): Observable<ProductDetail[]> {
    const p: Product | undefined = this.products$.getValue().find((p: Product): boolean => p.product_id === uuid);
    const url: string = `${this.HOST}api/v1/client/product/detail`;

    return this.http.get<ProductDetail[]>(url, {
      params: { id: uuid },
      withCredentials: true
    })
      .pipe(
        map((arr: ProductDetail[]) => arr.map((detail: ProductDetail) => {
            if (p) {
              detail.name = p.name;
              detail.desc = p.desc;
              detail.currency = p.currency;
              detail.price = p.price;
            }
            return detail;
          })
        )
      );
  }

}
