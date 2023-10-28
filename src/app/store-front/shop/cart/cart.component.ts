import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map, Observable, of} from "rxjs";
import {CartService} from "./cart.service";
import {DirectiveModule} from "../../../directive/directive.module";

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
          <div class="flow-root">
            <ul role="list" class="-my-6 divide-y divide-gray-200">
              <li class="flex py-6" *ngFor="let detail of carts$ | async; let i = index">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img [src]="detail.url"
                       alt="product image{{ i }}"
                       class="h-full w-full object-cover object-center">
                </div>

                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <h3>{{ detail.product_name }}</h3>
                      <p class="ml-4">{{ currency(detail.currency) }}{{ detail.price }}</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{{ detail.colour }}</p>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <div class="">
                      <p class="text-gray-500">size {{ detail.size }}</p>
                      <p class="text-gray-500">qty {{ detail.qty }}</p>
                    </div>

                    <div class="flex">
                      <button type="button"
                              class="font-medium text-[var(--app-theme-hover)]"
                              [asyncButton]="remove(detail.sku)"
                      >Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Total amount -->
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p *ngIf="total() | async as total">{{ currency('ngn') }}{{ total }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div class="mt-6">
          <button type="submit"
                  class="
              w-full px-6 py-3 text-base font-medium text-white
              shadow-sm flex items-center justify-center
              rounded-md border border-transparent
              bg-[var(--app-theme)] hover:bg-[var(--app-theme-hover)]
              "
                  (click)="checkout()"
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
  // TODO fix total currency
  private readonly cartService = inject(CartService);

  carts$ = this.cartService.cart$;

  currency = (str: string): string => this.cartService.currency(str)

  /** Closes component */
  closeComponent = (): void => {
    this.cartService.close = false;
  }

  remove(sku: string): Observable<number> {
    return this.cartService.removeFromCart(sku);
  }

  total = (): Observable<number> => {
    return this.carts$.pipe(
      map((arr) => {
        let sum = 0;
        for (let cart of arr) {
          sum += (cart.qty * cart.price);
        }
        return sum;
      })
    );
  }

  checkout(): void { }

}
