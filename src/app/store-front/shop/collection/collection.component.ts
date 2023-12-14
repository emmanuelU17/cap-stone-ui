import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Collection, Filter} from "../shop.helper";
import {CollectionService} from "./collection.service";
import {ShopService} from "../shop.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {CartService} from "../../checkout/cart/cart.service";
import {PaginatorComponent} from "../../../shared-comp/paginator/paginator.component";
import {Page} from "../../../global-utils";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink, PaginatorComponent],
  templateUrl: './collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {

  private readonly footerService = inject(FooterService);
  private readonly cartService = inject(CartService);
  private readonly collectionService = inject(CollectionService);
  private readonly utilService = inject(ShopService);

  totalElements = 0; // current total elements rendered
  iteration = (num: number): number[] => this.utilService.getRange(num);
  currency = (str: string): string => this.cartService.currency(str);

  activeGridIcon: boolean = true; // Approves if products should be displayed x3 or x4 in the x-axis
  filterByPrice: boolean = true; // A variable need to keep the state of price filter for future filtering
  displayFilter: boolean = false; // Displays filter button

  // Fetch Collections
  collections$ = this.collectionService.cols$.pipe(
    map((arr: Collection[]) => {
      const collection: string[] = arr.map(m => m.collection);
      const filter: Filter<string>[] = [{isOpen: false, parent: 'collections', children: collection}];
      return filter;
    })
  );

  private currentCollection$: Observable<Collection> = this.collectionService.cols$
    .pipe(map((collections: Collection[]) => collections[0]), take(1));

  // On load of shop/collection, fetch products based on the first collection
  products$ = this.collectionImpl();

  private collectionImpl(page: number = 0): Observable<{ state: string, error?: string, data?: Page<Product> }> {
    return this.currentCollection$.pipe(
      switchMap((col: Collection) => this.footerService.currency$
        .pipe(
          switchMap((currency) => this.collectionService
            .productsBasedOnCollection(col.collection_id, currency, page)
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
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
    );
  }

  /**
   * Filters products array in ascending or descending order based on price
   * */
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

    this.currentCollection$ = of(collection);

    this.products$ = this.footerService.currency$
      .pipe(
        switchMap((currency) => this.collectionService
          .productsBasedOnCollection(collection.collection_id, currency)
          .pipe(map((arr: Page<Product>) => ({ state: 'LOADED', data: arr })))
        )
      )
  }

  /**
   * Re-renders products pages based on page number clicked
   * */
  pageNumberClick(num: number): void {
    this.products$ = this.collectionImpl(num);
  }

}
