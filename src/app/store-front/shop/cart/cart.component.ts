import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map, Observable, switchMap} from "rxjs";
import {CartService} from "./cart.service";
import {DirectiveModule} from "../../../directive/directive.module";
import {Cart} from "../shop.helper";
import {FooterService} from "../../utils/footer/footer.service";
import {SarreCurrency, VARIABLE_IS_NUMERIC} from "../../../global-utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DirectiveModule],
  template: `
    <div class="w-full h-full bg-white">

      <!-- Contents -->
      <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <!-- Head and close button -->
        <div class="flex items-start justify-between">
          <h2 class="text-lg font-medium text-gray-900 border-b border-[var(--app-theme)]">Shopping cart</h2>
          <div class="ml-3 flex h-7 items-center">
            <button type="button" (click)="closeComponent()" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Close panel</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-8">
          <ng-container *ngIf="carts$ | async as carts">
            <ng-container *ngIf="carts !== undefined && carts !== null && carts.length > 0; else empty">
              <div class="flow-root">
                <ul role="list" class="-my-6 divide-y divide-gray-200">
                  <li class="flex py-6" *ngFor="let detail of carts; let i = index">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img [src]="detail.url"
                           alt="product image{{ i }}"
                           class="h-full w-full object-cover object-center">
                    </div>

                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3 class="font-app-card cursor-pointer hover:border-b hover:border-black"
                              (click)="moreInfo(detail.product_id)">{{ detail.product_name }}</h3>
                          <p class="font-app-card ml-4">{{ currency(detail.currency) }}{{ detail.price }}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">{{ detail.colour }}</p>
                      </div>
                      <div class="flex flex-1 items-end justify-between text-sm">
                        <div class="">
                          <p class="text-gray-500">{{ detail.size }}</p>
                          <input type="number"
                                 [value]="detail.qty"
                                 (keyup)="qtyChange($event, detail.sku)"
                                 class="p-2.5 flex-1 w-full rounded-sm border border-solid border-[var(--border-outline)]">
                        </div>

                        <div class="flex">
                          <button type="button"
                                  class="font-medium text-[var(--app-theme-hover)]"
                                  [asyncButton]="remove(detail.sku)"
                          >Remove</button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </ng-container>

            <ng-template #empty>Your cart is empty</ng-template>

          </ng-container>

        </div>

      </div>

      <!-- Total amount -->
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p *ngIf="total() | async as total"><span *ngIf="currency$ | async as c">{{ c }}</span>{{ total }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div class="mt-6">
          <button type="submit"
                  (click)="checkout()"
                  class="
              w-full px-6 py-3 text-base font-medium text-white
              shadow-sm flex items-center justify-center
              rounded-md border border-transparent
              bg-[var(--app-theme)] hover:bg-[var(--app-theme-hover)]
              "
          >Checkout</button>
        </div>
        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or
            <button type="button"
                    class="font-medium text-[var(--app-theme-hover)]"
                    (click)="closeComponent()"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  private readonly cartService = inject(CartService);
  private readonly footService = inject(FooterService);
  private readonly router = inject(Router);

  carts$ = this.cartService.cart$;
  currency$ = this.footService.currency$
    .pipe(switchMap((c: SarreCurrency) => this.currency(c)));

  currency = (str: string): string => this.cartService.currency(str);

  /**
   * Displays more info about Product
   * */
  moreInfo(productId: string): void {
    this.router.navigate([`/shop/category/product/${productId}`]);
    this.closeComponent();
  }

  /**
   * Closes CartComponent
   * */
  closeComponent = (): void => {
    this.cartService.close = false;
  }

  /**
   * Removes Item from Cart
   * */
  remove(sku: string): Observable<number> {
    return this.cartService.removeFromCart(sku);
  }

  /**
   * Sums the total of product in cart
   * */
  total = (): Observable<number> => {
    return this.carts$
      .pipe(map((arr: Cart[]) =>
        arr.reduce((sum: number, cart: Cart) => sum + (cart.qty * cart.price), 0)));
  }

  /**
   * Receives users input for the total amount of items
   * https://angular.io/guide/user-input
   * */
  qtyChange(event: KeyboardEvent, sku: string): void {
    const str = (event.target as HTMLInputElement).value;

    if (!VARIABLE_IS_NUMERIC(str)) {
      return;
    }

    // TODO update users qty in server
    const qty = Number(str);

    // if (qty <= 0) {
    //   this.remove(sku);
    // } else {
    //
    // }
  }

  checkout(): void { }

}
