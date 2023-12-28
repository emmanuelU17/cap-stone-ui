import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map, Observable} from "rxjs";
import {Page, SarreCurrency} from "../../../../global-utils";
import {ProductResponse, UpdateCollection} from "../../../shared-util";

@Injectable({
  providedIn: 'root'
})
export class UpdateCollectionService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /** Returns a Page of Product Response based on CollectionResponse id and pagination params */
  allProductsByCollection(
    id: string,
    page: number = 0,
    size: number = 20,
    currency: SarreCurrency
  ): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/collection/products`
    return this.http.get<Page<ProductResponse>>(url, {
      headers: { 'content-type': 'application/json' },
      params: {
        collection_id: id,
        page: page,
        size: size,
        currency: currency
      },
      responseType: 'json',
      withCredentials: true
    });
  }

  updateCollection(body: UpdateCollection): Observable<number> {
    const url = `${this.HOST}api/v1/worker/collection`;
    return this.http.put<UpdateCollection>(url, body, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<UpdateCollection>) => res.status));
  }

}
