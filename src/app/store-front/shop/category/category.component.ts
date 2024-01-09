import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Category, Filter} from "../shop.helper";
import {CategoryService} from "./category.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {Page} from "../../../global-utils";
import {PaginatorComponent} from "../../../shared-comp/paginator/paginator.component";
import {UtilService} from "../../../service/util.service";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink, PaginatorComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly footService = inject(FooterService);
  private readonly categoryService = inject(CategoryService);
  private readonly utilService = inject(UtilService);

  totalElements = 0; // current total elements rendered
  iteration = (num: number): number[] => this.utilService.getRange(num);
  currency = (str: string): string => this.footService.currency(str);

  activeGridIcon = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice = true; // A variable need to keep the state of price filter for future filtering
  displayFilter = false; // Displays filter button

  // Categories
  readonly categories$ = this.categoryService._categories$
    .pipe(
      map((arr: Category[]) => {
        const category: string[] = arr.map(m => m.category);
        const filter: Filter<string>[] = [{ isOpen: false, parent: 'categories', children: category }];
        return filter;
      })
    );

  private currentCategory$ = this.categoryService._categories$
    .pipe(map((cat: Category[]) => cat[0]), take(1));

  // on load of shop/category, fetch products based on the first category
  products$ = this.categoryImpl();

  /**
   * Filters products array in ascending or descending order based on price
   * */
  ascendingOrDescending = (arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr);

  categoryImpl(page: number = 0): Observable<{ state: string, error?: string, data?: Page<Product> }> {
    return this.currentCategory$
      .pipe(
        switchMap((category: Category) => this.footService.currency$
          .pipe(
            switchMap((currency) => this.categoryService
              .productsBasedOnCategory(category.category_id, currency, page)
              .pipe(map((arr: Page<Product>) => {
                if (arr) {
                  this.totalElements = arr.content.length;
                }
                return { state: 'LOADED', data: arr };
              }))
            )
          )
        ),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) =>
          of({ state: 'ERROR', error: err.error ? err.error.message : err.message })
        )
    );
  }

  /**
   * Refreshes allProduct array with new contents which is based on category clicked.
   *
   * @param str is the category
   * @return void
   * */
  filterProductsByCategory(str: string): void {
    const arr: Category[] = this.categoryService.categories;
    const category = arr.find(c => c.category === str);

    if (!category) {
      return;
    }

    this.currentCategory$ = of(category);

    // Make call to server
    this.products$ = this.footService.currency$
      .pipe(
        switchMap((currency) => this.categoryService
          .productsBasedOnCategory(category.category_id, currency)
          .pipe(map((arr: Page<Product>) => ({ state: 'LOADED', data: arr })))
        )
      )
  }

  /**
   * Re-renders products pages based on page number clicked
   * */
  pageNumberClick(num: number): void {
    this.products$ = this.categoryImpl(num);
  }

}
