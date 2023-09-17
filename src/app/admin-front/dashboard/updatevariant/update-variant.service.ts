import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {map, Observable} from "rxjs";
import {UpdateVariant} from "./update-variant";

@Injectable({
  providedIn: 'root'
})
export class UpdateVariantService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  updateVariant(payload: UpdateVariant): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product/detail`
    return this.http.put<UpdateVariant>(url, payload, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<UpdateVariant>) => res.status));
  }

}
