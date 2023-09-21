import {Injectable} from '@angular/core';
import {ProductDetailResponse} from "../../shared-util";
import {Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UpdateProductService {
  HOST: string | undefined;

  productDetailResponse$: Observable<ProductDetailResponse[]> = of();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /** Fetch ProductDetail based on id */
  fetchProductDetails(id: string): Observable<ProductDetailResponse[]> {
    const url: string = `${this.HOST}api/v1/worker/product/detail`;
    return this.http.get<ProductDetailResponse[]>(url, {
      params: { id: id },
      responseType: 'json',
      withCredentials: true
    }).pipe(
      tap((arr: ProductDetailResponse[]): void => {
        this.productDetailResponse$ = of(arr);
      })
    );
  }

}
