import {ChangeDetectionStrategy, Component, DestroyRef, inject, Renderer2, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DirectiveModule} from "../../../directive/directive.module";
import {CardComponent} from "../../utils/card/card.component";
import {CartService} from "./cart.service";
import {FooterService} from "../../utils/footer/footer.service";
import {Router} from "@angular/router";
import {HomeService} from "../../home/home.service";
import {debounceTime, distinctUntilChanged, fromEvent, map, Observable, of, switchMap, tap} from "rxjs";
import {SarreCurrency, VARIABLE_IS_NUMERIC} from "../../../global-utils";
import {Cart} from "../../shop/shop.helper";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
                            <li class="flex py-6" *ngFor="let detail of carts$ | async; let i = index">
                                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img [src]="detail.url"
                                         alt="product image{{ i }}"
                                         class="h-full w-full object-cover object-center">
                                </div>
                                <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div class="flex justify-between text-base font-medium text-gray-900">
                                            <h3 (click)="route('/shop/category/product/' + detail.product_id)"
                                                class="font-app-card cursor-pointer hover:border-b hover:border-black"
                                            >{{ detail.product_name }}</h3>
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
                    <button type="submit"
                            (click)="route('/checkout')"
                            class=" w-full px-6 py-3 text-base font-medium text-white shadow-sm flex items-center justify-center rounded-md border border-transparent bg-[var(--app-theme)] hover:bg-[var(--app-theme-hover)]"
                    >
                        Checkout
                    </button>
                </div>
                <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                        or
                        <button type="button"
                                class="font-medium text-[var(--app-theme-hover)]"
                                (click)="route('/shop/category')"
                        >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                    </p>
                </div>
            </div>

            <div class="py-2">
                <div class="p-3.5 flex justify-center">
                    <h1 class="feature-font w-fit capitalize font-bold text-[var(--app-theme)] border-b border-b-[var(--app-theme)]"
                    >you may also like</h1>
                </div>

                <div class="p-2 xl:p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <button
                            *ngFor="let product of products$ | async; let i = index"
                            (click)="route('/shop/category/product/' + product.product_id)"
                    >
                        <app-card
                                [url]="product.image"
                                [name]="product.name"
                                [currency]="currency(product.currency)"
                                [price]="product.price"
                        ></app-card>
                    </button>
                </div>
            </div>

        } @else {
            <div class="h-full pl-2 text-center">
                <div class="w-fit mb-4 text-left border-[var(--app-theme)] border-b">
                    <h1 class="capitalize text-2xl text-[var(--app-theme)]">Your cart</h1>
                </div>
                <h5 class="text-xs">Your cart is currently empty</h5>
                <button (click)="route('/shop/category')" type="button" class="p-2 uppercase bg-[var(--app-theme)]">
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
  private readonly render = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly homeService = inject(HomeService);

  readonly products$ = this.homeService.products$;
  readonly spinner = signal<boolean>(false);

  carts$ = this.cartService.cart$;
  currency$ = this.footService.currency$
    .pipe(switchMap((c: SarreCurrency) => this.currency(c)));

  currency = (str: string): string => this.footService.currency(str);

  route = (route: string): void => { this.router.navigate([`${route}`]); }

  /**
   * Removes Item from Cart
   * */
  remove = (sku: string): Observable<number> => this.cartService.removeFromCart(sku);

  /**
   * Sums the total of product in cart
   * */
  total$ = this.carts$
    .pipe(map((arr: Cart[]) => arr.reduce((sum: number, cart: Cart) => sum + (cart.qty * cart.price), 0)));

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

}
