import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {map, Observable, startWith, switchMap, take} from "rxjs";
import {Category, Filter} from "../shop.helper";
import {CategoryService} from "../service/category.service";
import {ProductService} from "../service/product.service";
import {UtilService} from "../service/util.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly utilService: UtilService = inject(UtilService);

  iteration = (num: number) => this.utilService.getRange(num);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering
  displayFilter: boolean = false; // Displays filter button

  // Categories
  private categories$: Observable<Category[]> = this.categoryService._categories$;
  private firstCategory$: Observable<Category> = this.categories$
    .pipe(map((collections: Category[]) => collections[0]), take(1));

  productsOnCategory$: Observable<Product[]> = this.firstCategory$.pipe(
    switchMap((category: Category) => this.categoryService.productsBasedOnCategory(category.id)),
    startWith({ state: 'LOADING' })
  );

  // Filter based on the firstCategory and Sort array based on filterByPrice status
  products$: Observable<Product[]> = this.firstCategory$.pipe(
    switchMap((firstCategory: Category) => this.productService._products$.pipe(
      map((arr: Product[]) => arr.filter((prod: Product): boolean => prod.category === firstCategory.category)))
    ),
    map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr))
  );

  combine$: Observable<{
    state: string,
    error?: string,
    products?: Product[],
    filter?: Filter<string>[]
  }> = this.utilService.getCombine$(this.products$, this.categories$, 'categories');

  /** Re-renders product array to filter products by price */
  onclickFilterByPrice(bool: boolean): void {
    this.filterByPrice = bool;
    this.products$ = this.products$
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(bool, arr)));
  }

  /**
   * Refreshes allProduct array with new contents which is based on category clicked.
   * @param str is the category clicked
   * @return void
   * */
  setEmitter(str: string): void {
    this.products$ = this.categoryService
      .productsBasedOnCategory(str)
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr)));
  }

}
