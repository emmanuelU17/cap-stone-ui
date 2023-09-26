import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {Category} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  HOST: string | undefined;

  private categories$ = new BehaviorSubject<Category[]>([]);
  _categories$ = this.categories$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

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
   * @param id is the category uuid
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * */
  productsBasedOnCategory(id: string, page: number = 0, size: number = 20): Observable<Product[]> {
    const url: string = `${this.HOST}api/v1/client/category/products`;
    return this.http.get<Page<Product>>(url, {
      params: {
        category_id: id,
        page: page,
        size: size
      },
      withCredentials: true
    }).pipe(
      map((page: Page<Product>): Product[] =>
        page.content === undefined || page.content === null ? [] : page.content)
    );
  }

}
