import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {Page} from "../../../../global-utils/global-utils";
import {ProductDetail, ProductResponse, UpdateProduct} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  HOST: string | undefined;

  private productIDSubject$ = new BehaviorSubject<string>('');
  private products$ = new BehaviorSubject<Page<ProductResponse> | undefined>(undefined);
  _products$ = this.products$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  setProductId(id: string): void {
    this.productIDSubject$.next(id);
  }

  getProductID(): string {
    return this.productIDSubject$.getValue();
  }

  /** On load of application this set Products array */
  setProducts(arr: Page<ProductResponse>): void {
    this.products$.next(arr);
  }

  /**
   * Responsible for making a PUT call to server to update a product
   * @param obj of type Product
   * @return Observable of type HttpStatus
   * */
  updateProduct(obj: UpdateProduct): Observable<number> {
    return this.http.put<HttpResponse<any>>(this.HOST + 'api/v1/worker/product', obj, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
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

  /** Fetch ProductDetail based on id */
  fetchProductDetails(id: string): Observable<ProductDetail[]> {
    const url: string = `${this.HOST}api/v1/worker/product/detail`;
    return this.http.get<ProductDetail[]>(url, {
      params: {id: id},
      responseType: 'json',
      withCredentials: true
    });
  }

  /** Called on load of application */
  fetchAllProducts(page: number = 0, size: number = 30): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/product`;
    return this.http.get<Page<ProductResponse>>(url, {
      headers: {'content-type': 'application/json'},
      params: {page: page, size: size},
      withCredentials: true
    });
  }

}
