import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {CollectionResponse} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  HOST: string | undefined;

  private subject = new BehaviorSubject<CollectionResponse[]>([]);
  _collections$ = this.subject.asObservable();
  collections: CollectionResponse[] = [];

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  // Delete collection based on id
  deleteCollection(id: string): Observable<number> {
    const url = `${this.HOST}api/v1/worker/collection`;
    return this.http.delete<HttpResponse<any>>(url,{
      observe: 'response',
      params: {id: id},
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

  // Fetch Collection
  fetchCollections(): Observable<CollectionResponse[]> {
    const url = `${this.HOST}api/v1/worker/collection`;
    return this.http.get<CollectionResponse[]>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<CollectionResponse[]>) => {
        const body: CollectionResponse[] | null = res.body;
        if (!body) {
          const arr: CollectionResponse[] = [];
          return arr;
        }

        this.collections = body;
        this.subject.next(body);
        return body;
      })
    );
  }

}
