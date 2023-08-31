import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {map, Observable, switchMap, take} from "rxjs";
import {Filter} from "../shop.helper";
import {CollectionService} from "../service/collection.service";
import {ProductService} from "../service/product.service";
import {UtilService} from "../service/util.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  private collectionService: CollectionService = inject(CollectionService);
  private productService: ProductService = inject(ProductService);
  public utilService: UtilService<string> = inject(UtilService<string>);
  private render: Renderer2 = inject(Renderer2);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering

  // Fetch Collections
  private collections$: Observable<string[]> = this.collectionService._collections$;
  private firstCollection$: Observable<string> = this.collections$
    .pipe(map((collections: string[]) => collections[0]), take(1));

  // Filter based on the firstCollection and Sort array based on filterByPrice status
  products$: Observable<Product[]> = this.firstCollection$.pipe(
    switchMap((firstCollection: string) => this.productService._products$.pipe(
      map((arr: Product[]) => arr.filter((prod: Product): boolean => prod.collection === firstCollection))
    )),
    map((arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr))
  );

  combine$: Observable<{
    state: string,
    error?: string,
    products?: Product[],
    filter?: Filter<string>[]
  }> = this.utilService.getCombine$(this.products$, this.collections$, 'collections');

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
