import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Category} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Page, Product} from "../../../../global-utils/global-utils";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  HOST: string | undefined;

  private categories$ = new BehaviorSubject<string[]>([]);
  _categories$ = this.categories$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /** Sets categories observable on load of application */
  setCategories(arr: string[]): void {
    this.categories$.next(arr);
  }

  /**
   * Returns all categories from server that are marked as visible
   * @return Observable of Category array
   * */
  fetchCategories(): Observable<string[]> {
    const url: string = `${this.HOST}api/v1/client/category`;
    return this.http.get<Category[]>(url, {
      withCredentials: true
    }).pipe(map((categories: Category[]): string[] => categories.map((category: Category) => category.category)));
  }

  /**
   * Fetches products based on category name
   * @param name is the product name
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * */
  fetchProductsBasedOnCategoryName(name: string = '', page: number = 0, size: number = 18): Observable<Product[]> {
    const url: string = `${this.HOST}api/v1/client/category/product`;
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
