import {inject, Injectable} from '@angular/core';
import {environment} from "@/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Category, Page, SarreCurrency} from "@/app/global-utils";
import {BehaviorSubject, Observable, of, switchMap, tap} from "rxjs";
import {ProductDetail} from "./shop.helper";
import {Product} from "@/app/store-front/store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly subject = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this.subject.asObservable();

  readonly currentCategorySubject = new BehaviorSubject<number | undefined>(undefined);
  readonly category$ = this.currentCategorySubject
    .asObservable()
    .pipe(
      switchMap((num) => num
        ? of(num)
        : this.categories$.pipe(switchMap((arr) => of(arr[0].category_id)))
      ),
    );

  /**
   * Returns a {@code ProductDetail} array based on {@code Product} uuid.
   * */
  productDetailsByProductUUID = (uuid: string, c: SarreCurrency): Observable<ProductDetail[]> =>
    this.http
      .get<ProductDetail[]>(
        `${this.HOST}api/v1/client/product/detail?product_id=${uuid}&currency=${c}`,
        { withCredentials: true }
      );

  /**
   * Returns all categories from server that are marked as visible
   *
   * @return Observable of Category array
   * */
  allCategories = (): Observable<Category[]> => this.http
    .get<Category[]>(`${this.HOST}api/v1/client/category`, { withCredentials: true })
    .pipe(tap((arr: Category[]): void => this.subject.next(arr)));

  /**
   * returns all products based on categoryId.
   *
   * @param categoryId is the category id
   * @param page is the page number
   * @param size is the amount of items to be displayed on a page
   * @param c
   * @return Observable of Page<Product>
   * */
  productsBasedOnCategoryId = (
    categoryId: number,
    c: SarreCurrency,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<Product>> => this.http
    .get<Page<Product>>(
      `${this.HOST}api/v1/client/category/products?category_id=${categoryId}&currency=${c}&page=${page}&size=${size}`,
      { withCredentials: true }
    );

}
