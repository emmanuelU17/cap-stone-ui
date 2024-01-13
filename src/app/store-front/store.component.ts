import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CategoryService} from "./shop/category/category.service";
import {catchError, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "./utils/navigation/store-front-navigation.component";
import {Router, RouterOutlet} from "@angular/router";
import {HomeService} from "./home/home.service";
import {FooterComponent} from "./utils/footer/footer.component";
import {CartService} from "./order/cart/cart.service";
import {FooterService} from "./utils/footer/footer.service";

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, StoreFrontNavigationComponent, RouterOutlet, FooterComponent],
  template: `
    @if (combine$ | async; as combine) {

      @switch (combine.state) {

        @case ('LOADING') {
          <div class="lg-scr h-full p-20 flex justify-center items-center">
            <h1 class="capitalize text-[var(--app-theme-hover)]">
              loading...
            </h1>
          </div>
        }
        @case ('ERROR') {
          <div class="lg-scr p-10 capitalize text-3xl text-red-500">
            Error {{ combine.error }}
          </div>
        }

        @case ('LOADED') {
          <div class="w-full h-full flex flex-col">
            <div class="lg-scr z-10 border-b border-transparent fixed left-0 top-0 right-0">
              <app-store-front-navigation-navigation
                [count]="(count$ | async) || 0"
                [categories]="(hierarchy$ | async) || []"
                (routeEmitter)="onChildRoute($event)"
                (categoryEmitter)="onCategoryClicked($event)"
              ></app-store-front-navigation-navigation>
            </div>

            <div class="flex-1">
              <router-outlet></router-outlet>
            </div>

            <div class="lg-scr">
              <app-footer></app-footer>
            </div>
          </div>
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {

  private readonly footerService = inject(FooterService);
  private readonly categoryService = inject(CategoryService);
  private readonly homeService = inject(HomeService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  private readonly cartItems$ = this.footerService.currency$
    .pipe(switchMap((currency) => this.cartService.cartItems(currency)));
  private readonly homeProducts$ = this.footerService.currency$
    .pipe(switchMap((currency) => this.homeService.homeProducts(currency)));
  private readonly categories$ = this.categoryService.allCategories();

  readonly count$ = this.cartService.count$;
  readonly hierarchy$ = this.categoryService.categories$

  /**
   * On load of storefront make call to server to return categories, cart and
   * products from home front to improve UI/UX.
   * */
  combine$: Observable<{ state: string, error?: string }> =
    combineLatest([this.cartItems$, this.homeProducts$, this.categories$])
      .pipe(
        map(() => ({ state: 'LOADED' })),
        startWith({ state: 'LOADING' }),
        catchError((err: HttpErrorResponse) =>
          of({ state: 'ERROR', error: err.error ? err.error.message : err.message })
        )
      );

  /**
   * Update {@code RouterOutlet} based on routes clicked in navigation bar.
   * */
  onChildRoute(route: string): void {
    this.router.navigate([`${route}`]);
  }

  /**
   * Update {@code currentCategorySubject} method in
   * {@code category.service.ts} on the categories clicked from navigation bar.
   * */
  onCategoryClicked(obj: { categoryId: number; name: string }): void {
    this.categoryService.currentCategorySubject.next(obj.categoryId);
  }

}
