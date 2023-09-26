import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Category, Filter} from "../shop.helper";
import {CategoryService} from "../service/category.service";
import {UtilService} from "../service/util.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly utilService: UtilService = inject(UtilService);

  iteration = (num: number): number[] => this.utilService.getRange(num);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering
  displayFilter: boolean = false; // Displays filter button

  // Categories
  categories$ = this.categoryService._categories$.pipe(
    map((arr: Category[]) => {
      const category: string[] = arr.map(m => m.category);
      const filter: Filter<string>[] = [{ isOpen: false, parent: 'categories', children: category }];
      return filter;
    })
  );

  private readonly firstCategory$: Observable<Category> = this.categoryService._categories$
    .pipe(map((collections: Category[]) => collections[0]), take(1));

  // On load of shop/category, fetch products based on the first category
  products$: Observable<{
    state: string,
    error?: string,
    data?: Product[]
  }> = this.firstCategory$.pipe(
    switchMap((category: Category) =>
      this.categoryService.productsBasedOnCategory(category.category_id)
        .pipe(map((arr: Product[]) => ({ state: 'LOADED', data: arr })))
    ),
    startWith({ state: 'LOADING' }),
    catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
  );

  /** Filters products array in ascending or descending order based on price */
  ascendingOrDescending = (arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr);

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

    // Make call to server
    this.products$ = this.categoryService.productsBasedOnCategory(category.category_id)
      .pipe(
        map((arr: Product[]) => ({ state: 'LOADED', data: arr })),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
      );
  }

}
