import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map, Observable} from "rxjs";
import {ProductResponse, UpdateCategory} from "../../../shared-util";
import {Page, SarreCurrency} from "../../../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class UpdateCategoryService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /** Returns a Page of Product Response based on CategoryResponse id and pagination params */
  allProductsByCategory(
    id: string,
    page: number = 0,
    size: number = 20,
    currency: SarreCurrency
  ): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/category/products`
    return this.http.get<Page<ProductResponse>>(url, {
      headers: { 'content-type': 'application/json' },
      params: {
        category_id: id,
        page: page,
        size: size,
        currency: currency
      },
      responseType: 'json',
      withCredentials: true
    });
  }

  updateCategory(body: UpdateCategory): Observable<number> {
    const url = `${this.HOST}api/v1/worker/category`;
    return this.http.put<UpdateCategory>(url, body, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<UpdateCategory>) => res.status));
  }

}
