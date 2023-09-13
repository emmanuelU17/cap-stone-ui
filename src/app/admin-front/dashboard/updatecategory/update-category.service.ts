import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ProductResponse} from "../../shared-util";
import {Page} from "../../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class UpdateCategoryService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  allProductByCategory(id: string, page: number = 0, size: number = 20): Observable<Page<ProductResponse>> {
    const url = `${this.HOST}api/v1/worker/category/products`
    return this.http.get<Page<ProductResponse>>(url, {
      headers: { 'content-type': 'application/json' },
      params: {
        id: id,
        page: page,
        size: size
      },
      responseType: 'json',
      withCredentials: true
    });
  }

}
