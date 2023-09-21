import {Injectable} from '@angular/core';
import {map, Observable, of, tap} from "rxjs";
import {Page} from "../../../global-utils";
import {ProductResponse, UpdateProduct} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  HOST: string | undefined;

  _products$: Observable<Page<ProductResponse>> = of();
  products: ProductResponse[] = [];

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /**
   * Responsible for making a PUT call to server to update a product
   * @param obj of type Product
   * @return Observable of type HttpStatus
   * */
  updateProduct(obj: UpdateProduct): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product`
    return this.http.put<UpdateProduct>(url, obj, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<UpdateProduct>) => res.status));
  }

  /**
   * Responsible for making a DELETE restful call to our serve to delete a product.
   * @param id of type string
   * @return Observable of type HttpStatus
   * */
  deleteProduct(id: string): Observable<number> {
    const url: string = `${this.HOST}api/v1/worker/product`;
    return this.http.delete<HttpResponse<any>>(url, {
      observe: 'response',
      params: {id: id},
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

  /** Called on load of application */
  fetchAllProducts(page: number = 0, size: number = 30): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/product`;
    return this.http.get<Page<ProductResponse>>(url, {
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
      params: { page: page, size: size },
      withCredentials: true
    }).pipe(
      tap((res: Page<ProductResponse>) => {
        this._products$ = of(res);
        this.products = res.content
      })
    );
  }

}
