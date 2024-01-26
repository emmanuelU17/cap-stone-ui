import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DirectiveModule} from "../../../directive/directive.module";
import {CardComponent} from "../../utils/card/card.component";
import {CartService} from "./cart.service";
import {FooterService} from "../../utils/footer/footer.service";
import {Router} from "@angular/router";
import {HomeService} from "../../home/home.service";
import {catchError, delay, map, Observable, of, startWith, switchMap} from "rxjs";
import {SarreCurrency, VARIABLE_IS_NUMERIC} from "../../../global-utils";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DirectiveModule, CardComponent],
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
  template: `
    <div class="lg-scr mg-top h-full w-full">

      @if (!!(carts$ | async)?.length) {

        <!-- Contents -->
        <div class="flex-1 overflow-y-auto pb-9 px-4 sm:px-6">
          <div class="flex items-start justify-between">
            <h2 class="text-lg font-medium text-gray-900 border-b border-[var(--app-theme)]">Shopping cart</h2>
          </div>

          <div class="mt-8">
            <div class="flow-root">
              <ul role="list" class="relative -my-6 divide-y divide-gray-200">

                @for (detail of carts$ | async; track detail.product_id; let i = $index) {
                  <li class="flex py-6">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img [src]="detail.url" alt="product image{{ i }}" class="h-full w-full object-cover object-center">
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3 (click)="route('/shop/product/' + detail.product_id)"
                              class="font-app-card cursor-pointer hover:border-b hover:border-black">
                            {{ detail.product_name }}
                          </h3>
                          <p class="font-app-card ml-4">{{ currency(detail.currency) }}{{ detail.price }}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">{{ detail.colour }}</p>
                      </div>
                      <div class="flex flex-1 items-end justify-between text-sm">
                        <div>
                          <p class="text-gray-500">{{ detail.size }}</p>
                          <input type="number" [value]="detail.qty" (keyup)="qtyChange($event, detail.sku, detail.qty)"
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
                }

                <!-- spinner -->
                @if (bool$ | async; as spin) {
                  <div class="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black opacity-50">
                    <div role="status" class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-[var(--app-theme)] align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                }
              </ul>
            </div>

          </div>

        </div>

        <!-- Total amount -->
        <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p *ngIf="total$ | async as total">
              <span *ngIf="currency$ | async as c">{{ c }}{{ total }}</span>
            </p>
          </div>
          <p class="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div class="mt-6">
            <button (click)="route('/order/checkout')" type="submit" class=" w-full px-6 py-3 text-base font-medium text-white shadow-sm flex items-center justify-center rounded-md border border-transparent bg-[var(--app-theme)] hover:bg-[var(--app-theme-hover)]">
              Checkout
            </button>
          </div>
          <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or
              <button (click)="route('/shop')" type="button" class="font-medium text-[var(--app-theme-hover)]">
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>

        <div class="py-2">
          <div class="p-3.5 flex justify-center">
            <h1
              class="feature-font w-fit capitalize font-bold text-[var(--app-theme)] border-b border-b-[var(--app-theme)]"
            >you may also like</h1>
          </div>

          <div class="p-2 xl:p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            @for (product of products$ | async; track product.product_id; let i = $index) {
              <button type="button" (click)="route('/shop/product/' + product.product_id)">
                <app-card [url]="product.image" [name]="product.name" [price]="product.price"
                          [currency]="currency(product.currency)"></app-card>
              </button>
            }
          </div>
        </div>

      } @else {
        <div class="h-full pl-2 text-center">
          <div class="w-fit mb-4 text-left border-[var(--app-theme)] border-b">
            <h1 class="capitalize text-2xl text-[var(--app-theme)]">Your cart</h1>
          </div>
          <h5 class="text-xs">Your cart is currently empty</h5>
          <button (click)="route('/shop')" type="button" class="p-2 uppercase bg-[var(--app-theme)]">
            continue shopping
          </button>
        </div>
      }

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  private readonly cartService = inject(CartService);
  private readonly footService = inject(FooterService);
  private readonly router = inject(Router);
  private readonly homeService = inject(HomeService);

  readonly products$ = this.homeService.products$;

  readonly carts$ = this.cartService.cart$;
  readonly currency$ = this.footService.currency$
    .pipe(switchMap((c: SarreCurrency) => this.currency(c)));

  currency = (str: string): string => this.footService.currency(str);

  route = (route: string): void => { this.router.navigate([`${route}`]); }

  /**
   * removes item from a users cart
   * */
  remove = (sku: string): Observable<number> => this.cartService.removeFromCart(sku);

  readonly total$ = this.cartService.total$;

  private readonly objSignal =
    signal<{ sku: string, qty: number  }>({ sku: '', qty: -1 });

  /**
   * Updates qty based on a {@code Product} sku. As far as bool,
   * it displays a loading screen 1070 ms after a user enters their input.
   * */
  bool$ = of(false);
  qtyChange(e: KeyboardEvent, sku: string, qty: number): void {
    const eventQty = (e.target as HTMLInputElement).value;

    if (!VARIABLE_IS_NUMERIC(eventQty))
      return;
    else if (VARIABLE_IS_NUMERIC(eventQty) && Number(eventQty) < 0)
      return;

    const num = Number(eventQty);

    this.objSignal.set({ sku: sku, qty: num === qty ? qty : num })

    this.bool$ = this.bool$
      .pipe(
        switchMap(() => of(this.objSignal()).pipe(delay(1070))),
        switchMap((obj: { sku: string, qty: number }) => obj.qty === 0
          ? this.remove(obj.sku)
            .pipe(map(() => false), startWith(true))
          : this.cartService.createCart({ sku: obj.sku, qty: obj.qty })
            .pipe(map(() => false), startWith(true))
        ),
        catchError(() => of(false))
      );
  }

}
