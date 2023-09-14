import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {CollectionResponse} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  HOST: string | undefined;

  _collections$: Observable<CollectionResponse[]> = of();
  collections: CollectionResponse[] = [];

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
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
          return [];
        }
        this.collections = body;
        this._collections$ = of(body);
        return body;
      })
    );
  }
}
