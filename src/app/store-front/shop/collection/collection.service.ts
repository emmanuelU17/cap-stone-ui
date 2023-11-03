import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {Collection} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page, SarreCurrency} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  HOST: string | undefined = environment.domain;

  private readonly http: HttpClient = inject(HttpClient);

  private subject$ = new BehaviorSubject<Collection[]>([]);
  cols$ = this.subject$.asObservable();

  isEmpty$ = (): Observable<boolean> => this.cols$.pipe(map((arr: Collection[]) => arr.length > 0));

  get collections(): Collection[] {
    return this.subject$.getValue();
  }

  /**
   * Returns all collections from server that are marked as visible
   *
   * @return Observable of Category array
   * */
  fetchCollections(): Observable<Collection[]> {
    const url: string = `${this.HOST}api/v1/client/collection`;
    return this.http.get<Collection[]>(url, {
      withCredentials: true
    }).pipe(tap((arr: Collection[]) => this.subject$.next(arr)));
  }

  /**
   * Fetches products based on collection id
   *
   * @param id is the product id
   * @param currency
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * */
  productsBasedOnCollection(
    id: string,
    currency: SarreCurrency,
    page: number = 0,
    size: number = 20
  ): Observable<Product[]> {
    const url: string = `${this.HOST}api/v1/client/collection/products`;
    return this.http.get<Page<Product>>(url, {
      params: {
        collection_id: id,
        page: page,
        size: size,
        currency: currency
      },
      withCredentials: true
    }).pipe(
      map((page: Page<Product>): Product[] =>
        page.content === undefined || page.content === null ? [] : page.content
      )
    );
  }

}
