import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Category} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page, SarreCurrency} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly categories$ = new BehaviorSubject<Category[]>([]);
  readonly _categories$ = this.categories$.asObservable();

  get categories(): Category[] {
    return this.categories$.getValue();
  }

  /**
   * Returns all categories from server that are marked as visible
   *
   * @return Observable of Category array
   * */
  fetchCategories(): Observable<Category[]> {
    const url: string = `${this.HOST}api/v1/client/category`;
    return this.http.get<Category[]>(url, {
      withCredentials: true
    }).pipe(tap((arr: Category[]) => this.categories$.next(arr)));
  }

  /**
   * Fetches products based on category name
   *
   * @param categoryId is the category id
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * @param currency
   * */
  productsBasedOnCategory(
    categoryId: number,
    currency: SarreCurrency,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<Product>> {
    const url: string = `${this.HOST}api/v1/client/category/products`;
    return this.http.get<Page<Product>>(url, {
      params: {
        category_id: categoryId,
        page: page,
        size: size,
        currency: currency
      },
      withCredentials: true
    });
  }

}
