import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CategoryService} from "./shop/category/category.service";
import {CollectionService} from "./shop/collection/collection.service";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "./utils/navigation/store-front-navigation.component";
import {RouterOutlet} from "@angular/router";
import {HomeService} from "./home/home.service";
import {FooterComponent} from "./utils/footer/footer.component";
import {CartService} from "./order/cart/cart.service";
import {FooterService} from "./utils/footer/footer.service";

@Component({
  selector: 'app-store',
  standalone: true,
  template: `
    <ng-container *ngIf="combine$ | async as combine" [ngSwitch]="combine.state">

      <ng-container *ngSwitchCase="'LOADING'">
        <div class="lg-scr h-full p-20 flex justify-center items-center">
          <h1 class="capitalize text-[var(--app-theme-hover)]">
            loading...
          </h1>
        </div>
      </ng-container>

      <ng-container *ngSwitchCase="'ERROR'">
        <div class="lg-scr p-10 capitalize text-3xl text-red-500">
          Error {{ combine.error }}
        </div>
      </ng-container>

      <div class="w-full h-full flex flex-col" *ngSwitchCase="'LOADED'">
        <div class="lg-scr z-10 border-b border-transparent fixed left-0 top-0 right-0">
          <app-store-front-navigation-navigation></app-store-front-navigation-navigation>
        </div>

        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>

        <div class="lg-scr">
          <app-footer></app-footer>
        </div>
      </div>
    </ng-container>
  `,
  imports: [CommonModule, StoreFrontNavigationComponent, RouterOutlet, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {

  private readonly footerService = inject(FooterService);
  private readonly categoryService = inject(CategoryService);
  private readonly collectionService = inject(CollectionService);
  private readonly homeService = inject(HomeService);
  private readonly cartService = inject(CartService);

  private readonly cartItems$ = this.footerService.currency$
    .pipe(switchMap((currency) => this.cartService.cartItems(currency)));
  private readonly homeProducts$ = this.footerService.currency$
    .pipe(switchMap((currency) => this.homeService.homeProducts(currency)));

  private readonly categories$ = this.categoryService.fetchCategories();
  private readonly collections$ = this.collectionService.fetchCollections();

  // On load of storefront routes, get necessary data to improve user experience
  combine$: Observable<{ state: string, error?: string }> =
    combineLatest([this.cartItems$, this.homeProducts$, this.categories$, this.collections$])
      .pipe(
        map(() => ({ state: 'LOADED' })),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) =>
          of({ state: 'ERROR', error: err.error ? err.error.message : err.message })
        )
      );

}
