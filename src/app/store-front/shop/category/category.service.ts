import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, switchMap, tap} from "rxjs";
import {environment} from "../../../../environments/environment";
import {Category, Page, SarreCurrency} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly subject = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this.subject.asObservable();

  readonly currentCategorySubject = new BehaviorSubject<number | undefined>(undefined);
  readonly category$: Observable<number> = this.currentCategorySubject
    .asObservable()
    .pipe(
      switchMap((num) => num
        ? of(num)
        : this.categories$.pipe(switchMap((arr) => of(arr[0].category_id)))
      ),
    );

  /**
   * Returns all categories from server that are marked as visible
   *
   * @return Observable of Category array
   * */
  allCategories(): Observable<Category[]> {
    const url = `${this.HOST}api/v1/client/category`;
    return this.http.get<Category[]>(url, { withCredentials: true })
      .pipe(tap((arr: Category[]): void => this.subject.next(arr)));
  }

  /**
   * returns all products based on categoryId
   *
   * @param categoryId is the category id
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * @param currency
   * @return Observable of Page<Product>
   * */
  productsBasedOnCategory(
    categoryId: number,
    currency: SarreCurrency,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<Product>> {
    const url = `${this.HOST}api/v1/client/category/products?category_id=${categoryId}&currency=${currency}&page=${page}&size=${size}`;
    return this.http
      .get<Page<Product>>(url, { withCredentials: true });
  }

}
