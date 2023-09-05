import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {map, Observable, switchMap, take} from "rxjs";
import {Filter} from "../shop.helper";
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
  private categoryService: CategoryService = inject(CategoryService);
  private productService: ProductService = inject(ProductService);
  public utilService: UtilService<string> = inject(UtilService<string>);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering
  displayFilter: boolean = false; // Displays filter button

  // Categories
  private categories$: Observable<string[]> = this.categoryService._categories$;
  private firstCategory$: Observable<string> = this.categories$
    .pipe(map((collections: string[]) => collections[0]), take(1));

  // Filter based on the firstCategory and Sort array based on filterByPrice status
  products$: Observable<Product[]> = this.firstCategory$.pipe(
    switchMap((firstCategory: string) => this.productService._products$.pipe(
      map((arr: Product[]) => arr.filter((prod: Product): boolean => prod.category === firstCategory)))
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
      .fetchProductsBasedOnCategoryName(str)
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr)));
  }

}
