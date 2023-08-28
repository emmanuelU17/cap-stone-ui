import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CategoryRequest} from "../../shared-util";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NewCategoryService {
  private HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  create(obj: CategoryRequest): Observable<number> {
    return this.http.post<HttpResponse<any>>(this.HOST + 'api/v1/worker/category', obj, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

}
