import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {map, Observable} from "rxjs";
import {CreateVariantData} from "./createVariantData";

@Injectable({
  providedIn: 'root'
})
export class CreateVariantService {

  private readonly HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  create(data: FormData): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product/detail`
    return this.http.post<CreateVariantData>(url, data, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<CreateVariantData>) => res.status));
  }

}
