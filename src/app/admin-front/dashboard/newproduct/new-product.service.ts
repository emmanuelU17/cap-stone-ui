import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NewProductService {
  private HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /**
   * Responsible for POST call to our server to create a new product
   * @param data of type FormData
   * @return Observable of type number
   * */
  create(data: FormData): Observable<number> {
    return this.http.post<HttpResponse<any>>(this.HOST + 'api/v1/worker/product', data, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

}
