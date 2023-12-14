import {ChangeDetectionStrategy, Component, DestroyRef, inject, Renderer2, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {debounceTime, distinctUntilChanged, fromEvent, map, Observable, of, switchMap, tap} from "rxjs";
import {CartService} from "./cart.service";
import {DirectiveModule} from "../../../directive/directive.module";
import {Cart} from "../../shop/shop.helper";
import {FooterService} from "../../utils/footer/footer.service";
import {SarreCurrency, VARIABLE_IS_NUMERIC} from "../../../global-utils";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
            <ng-container *ngIf="carts.length > 0; else empty">
              <div class="flow-root">
                <ul role="list" class="relative -my-6 divide-y divide-gray-200">
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
                        <div>
                          <p class="text-gray-500">{{ detail.size }}</p>
                          <input type="number"
                                 [value]="detail.qty"
                                 (click)="qtyChange(detail.sku)"
                                 class="qty-box p-2.5 flex-1 w-full rounded-sm border border-solid border-[var(--border-outline)]">
                        </div>

                        <div class="flex">
                          <button [asyncButton]="remove(detail.sku)" type="submit"
                                  class="font-medium text-[var(--app-theme-hover)]">
                              Remove
                          </button>
                        </div>
                      </div>
                    </div>

                  </li>

                    <!-- spinner -->
                    <div *ngIf="spinner() as spin"
                         [style]="{ 'display': spin ? 'flex' : 'none' }"
                         class="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black opacity-50"
                    >
                        <div role="status" class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-[var(--app-theme)] align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                              <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                  Loading...
                              </span>
                        </div>
                    </div>
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
          <p *ngIf="total() | async as total">
            <span *ngIf="currency$ | async as c">{{ c }}</span>
              {{ total }}
          </p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
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
  styles: [`
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  private readonly cartService = inject(CartService);
  private readonly footService = inject(FooterService);
  private readonly render = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  spinner = signal<boolean>(false);

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
  closeComponent = (): void => this.cartService.close(false);

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
   * Makes call to server on change of qty
   * */
  qtyChange(sku: string): void {
    const element = this.render.selectRootElement('.qty-box', true);

    fromEvent<KeyboardEvent>(element, 'keyup')
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        map((val: KeyboardEvent) => (val.target as HTMLInputElement).value),
        switchMap((value: string) => {
          if (!VARIABLE_IS_NUMERIC(value)) {
            return of(0);
          }

          const qty = Number(value);

          this.spinner.set(true);
          return qty < 1
            ? this.remove(sku).pipe(tap(() => this.spinner.set(false)))
            : this.cartService.createCart({ sku: sku, qty: qty })
              .pipe(tap(() => this.spinner.set(false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Displays contact information
   * */
  checkout(): void {
    this.router.navigate([``]);
    this.closeComponent();
  }

}