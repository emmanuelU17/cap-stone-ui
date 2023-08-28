import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CollectionRequest} from "../../shared-util";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewCollectionService {
  private HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /**
   * Responsible for POST call to our server to create a new collection
   * @param data of type FormData
   * @return Observable of type number
   * */
  create(data: CollectionRequest): Observable<number> {
    return this.http.post<HttpResponse<any>>(this.HOST + 'api/v1/worker/collection', data, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }
}
