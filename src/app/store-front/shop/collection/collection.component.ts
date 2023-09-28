import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Collection, Filter, SESSION_STORAGE_KEY} from "../shop.helper";
import {CollectionService} from "./collection.service";
import {ShopService} from "../shop.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink],
  templateUrl: './collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {

  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly utilService: ShopService = inject(ShopService);

  iteration = (num: number): number[] => this.utilService.getRange(num);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering
  displayFilter: boolean = false; // Displays filter button

  // Fetch Collections
  collections$ = this.collectionService._collections$.pipe(
    map((arr: Collection[]) => {
      const collection: string[] = arr.map(m => m.collection);
      const filter: Filter<string>[] = [{isOpen: false, parent: 'collections', children: collection}];
      return filter;
    })
  );

  private readonly firstCollection$: Observable<Collection> = this.collectionService._collections$
    .pipe(map((collections: Collection[]) => collections[0]), take(1));

  // On load of shop/collection, fetch products based on the first collection
  products$: Observable<{
    state: string,
    error?: string,
    data?: Product[]
  }> = this.firstCollection$.pipe(
    switchMap((col: Collection) =>
      this.collectionService.productsBasedOnCollection(col.collection_id)
        .pipe(map((arr: Product[]) => ({ state: 'LOADED', data: arr })))
    ),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
  );

  /** Passes needed detail for ProductDetail. e.g description */
  setProductClicked = (p: Product): void => {
    sessionStorage.setItem(SESSION_STORAGE_KEY.PRODUCT, JSON.stringify(p));
  }

  /** Filters products array in ascending or descending order based on price */
  ascendingOrDescending = (arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr);

  /**
   * Refreshes allProduct array with contents new contents which is based on collection clicked.
   *
   * @param str is the category
   * @return void
   * */
  filterProductsByCollection(str: string): void {
    const arr: Collection[] = this.collectionService.collections;
    const collection = arr.find(c => c.collection === str);

    if (!collection) {
      return;
    }

    this.products$ = this.collectionService.productsBasedOnCollection(collection.collection_id)
      .pipe(
        map((arr: Product[]) => ({ state: 'LOADED', data: arr })),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
      );
  }

}
