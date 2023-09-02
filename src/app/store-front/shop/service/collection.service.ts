import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Collection} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  HOST: string | undefined;

  private collections$ = new BehaviorSubject<string[]>([]);
  _collections$ = this.collections$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /** Sets collections observable on load of application */
  setCollection(arr: string[]): void {
    this.collections$.next(arr);
  }

  /**
   * Returns all collections from server that are marked as visible
   * @return Observable of Category array
   * */
  fetchCollections(): Observable<string[]> {
    const url: string = `${this.HOST}api/v1/client/collection`;
    return this.http.get<Collection[]>(url, {
      withCredentials: true
    }).pipe(map((cols: Collection[]): string[] => cols.map((col: Collection) => col.collection)));
  }

  /**
   * Fetches products based on collection name
   * @param name is the product name
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * */
  fetchProductsBasedOnCollectionName(name: string = '', page: number = 0, size: number = 18): Observable<Product[]> {
    const url: string = `${this.HOST}api/v1/client/collection/product`;
    return this.http.get<Page<Product>>(url, {
      params: {
        name: name,
        page: page,
        size: size
      },
      withCredentials: true
    }).pipe(map((page: Page<Product>): Product[] => page.content === undefined || page.content === null ? [] : page.content));
  }


}
