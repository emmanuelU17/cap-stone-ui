import {ChangeDetectionStrategy, Component, Renderer2} from '@angular/core';
import {map, Observable, switchMap, take} from "rxjs";
import {Product} from "../../../../global-utils/global-utils";
import {Filter} from "../shop.helper";
import {CategoryService} from "../service/category.service";
import {ProductService} from "../service/product.service";
import {UtilService} from "../service/util.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering

  products$: Observable<Product[]>;
  combine$: Observable<{ state: string, error?: string, products?: Product[], filter?: Filter<string>[] }>;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    public utilService: UtilService<string>,
    private render: Renderer2
  ) {
    // Categories
    const categories$: Observable<string[]> = this.categoryService._categories$;
    const firstCategory$: Observable<string> = categories$
      .pipe(map((categories: string[]) => categories[0]), take(1));

    // Products
    this.products$ = firstCategory$.pipe(
      // Filter based on the firstCategory
      switchMap((firstCategory: string) => this.productService._products$.pipe(
        map((arr: Product[]) => arr.filter((prod: Product): boolean => prod.category === firstCategory)))
      ),
      // Sort array based on filterByPrice status
      map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr))
    );

    // ForkJoin
    this.combine$ = this.utilService.getCombine$(this.products$, categories$, 'categories');
  }

  /** Display category filter on click of button */
  displayCategoryFilter(): void {
    this.render.selectRootElement('.filter-btn', true).style.display = 'block';
  }

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
    this.products$ = this.categoryService.fetchProductsBasedOnCategoryName(str)
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr)));
  }

}
