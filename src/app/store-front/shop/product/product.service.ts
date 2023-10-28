import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ProductDetail} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  productDetailsByProductUUID(uuid: string): Observable<ProductDetail[]> {
    const url: string = `${this.HOST}api/v1/client/product/detail?product_id=${uuid}`;
    return this.http.get<ProductDetail[]>(url, {
      withCredentials: true
    })
  }

}
