import {inject, Injectable} from '@angular/core';
import {ProductDetailResponse} from "../../../shared-util";
import {map, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UpdateProductService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /**
   * Fetch ProductDetail based on id
   * */
  fetchProductDetails(id: string): Observable<ProductDetailResponse[]> {
    const url: string = `${this.HOST}api/v1/worker/product/detail`;
    return this.http.get<ProductDetailResponse[]>(url, {
      params: { id: id },
      responseType: 'json',
      withCredentials: true
    });
  }

  /**
   * Delete Product Variant
   * */
  deleteVariant(sku: string): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product/detail/sku`;
    return this.http.delete<number>(url, {
      params: { sku: sku },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<number>) => res.status));
  }

}
