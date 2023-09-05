import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CollectionResponse} from "../../shared-util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  HOST: string | undefined;

  private collections$ = new BehaviorSubject<CollectionResponse[]>([]);
  _collections$ = this.collections$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  setCollections(arr: CollectionResponse[]): void {
    this.collections$.next(arr);
  }

  // Fetch Collection
  fetchCollections(): Observable<CollectionResponse[]> {
    const url = `${this.HOST}api/v1/worker/collection`;
    return this.http.get<CollectionResponse[]>(url, { withCredentials: true });
  }
}
