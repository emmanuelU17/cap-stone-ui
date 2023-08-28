import {ChangeDetectionStrategy, Component, Renderer2} from '@angular/core';
import {Product} from "../../../../global-utils/global-utils";
import {map, Observable, switchMap, take} from "rxjs";
import {Filter} from "../shop.helper";
import {CollectionService} from "../service/collection.service";
import {ProductService} from "../service/product.service";
import {UtilService} from "../service/util.service";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering

  products$: Observable<Product[]>;
  combine$: Observable<{ state: string, error?: string, products?: Product[], filter?: Filter<string>[] }>;

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    public utilService: UtilService<string>,
    private render: Renderer2
  ) {
    // Fetch Collections
    const collections$: Observable<string[]> = this.collectionService._collections$;
    const firstCollection$: Observable<string> = collections$
      .pipe(map((collections: string[]) => collections[0]), take(1));

    // Fetch products
    this.products$ = firstCollection$.pipe(
      // Filter based on the firstCollection
      switchMap((firstCollection: string) => this.productService._products$.pipe(
        map((arr: Product[]) => arr.filter((prod: Product): boolean => prod.collection === firstCollection))
      )),
      // Sort array based on filterByPrice status
      map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr))
    );

    // ForkJoin
    this.combine$ = this.utilService.getCombine$(this.products$, collections$, 'collections');
  }

  /** Display collection filter on click of button */
  displayCollectionFilter(): void {
    this.render.selectRootElement('.filter-btn', true).style.display = 'block';
  }

  /** Re-renders product array to filter products by price */
  onclickFilterByPrice(bool: boolean): void {
    this.filterByPrice = bool;
    this.products$ = this.products$
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(bool, arr)));
  }

  /**
   * Refreshes allProduct array with contents new contents which is based on collection clicked.
   * @param str is the category clicked
   * @return void
   * */
  setEmitter(str: string): void {
    this.products$ = this.collectionService.fetchProductsBasedOnCollectionName(str)
      .pipe(map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr)));
  }

}
