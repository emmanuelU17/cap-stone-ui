import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CategoryService} from "./shop/category/category.service";
import {CollectionService} from "./shop/collection/collection.service";
import {catchError, combineLatest, map, Observable, of, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Category, Collection} from "./shop/shop.helper";
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "./utils/navigation/store-front-navigation.component";
import {RouterOutlet} from "@angular/router";
import {CartIconService} from "./utils/carticon/cart-icon.service";

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, StoreFrontNavigationComponent, RouterOutlet],
  templateUrl: './store.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {

  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly collectionService: CollectionService = inject(CollectionService);

  private categories$: Observable<Category[]> = this.categoryService.fetchCategories();
  private collections$: Observable<Collection[]> = this.collectionService.fetchCollections();

  // On load of storefront routes, get necessary data to improve user experience
  combine$: Observable<{
    state: string,
    error?: string,
    categories?: Category[],
    collections?: Collection[]
  }> = combineLatest([this.categories$, this.collections$])
    .pipe(
      map((): { state: string } => ({ state: 'LOADED' })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
    );

  constructor(private readonly cartService: CartIconService) {
    this.cartService.clearCart();
  }

}
