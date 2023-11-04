import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Category, Filter} from "../shop.helper";
import {CategoryService} from "./category.service";
import {ShopService} from "../shop.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {CartService} from "../cart/cart.service";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly footService = inject(FooterService);
  private readonly cartService = inject(CartService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly utilService: ShopService = inject(ShopService);

  iteration = (num: number): number[] => this.utilService.getRange(num);
  currency = (str: string): string => this.cartService.currency(str);

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
    switchMap((category: Category) => this.footService.currency$
      .pipe(
        switchMap((currency) => this.categoryService
          .productsBasedOnCategory(category.category_id, currency)
          .pipe(map((arr: Product[]) => ({ state: 'LOADED', data: arr })))
        )
      )
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
    this.products$ = this.footService.currency$
      .pipe(
        switchMap((currency) => this.categoryService
          .productsBasedOnCategory(category.category_id, currency)
          .pipe(map((arr: Product[]) => ({ state: 'LOADED', data: arr })))
        )
      )
  }

}
