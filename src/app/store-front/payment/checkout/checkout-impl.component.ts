import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CartService} from "../cart/cart.service";

@Component({
  selector: 'app-checkout-impl',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    .cx-font-fam {
      font-family: 'Jost', sans-serif;
    }

    @media (max-width: 768px) {
      .cs-font {
        font-size: calc(8px + 1vw);
      }

      .banner {
        font-size: calc(5px + 1vw);
      }
    }
  `],
  template: `
    <div class="lg-scr mg-top">
        <!-- banner -->
        <div class="p-2 mb-2 md:p-4 md:mb-3 bg-neutral-100">

            <!-- mobile -->
            <div class="grid grid-cols-3 md:hidden">

                <button (click)="routeCart()" type="button" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
                    <div class="flex gap-1 justify-center">
                        <h1 class="cx-font-fam banner">01</h1>
                        <h3 class="cx-font-fam banner uppercase">shopping cart</h3>
                    </div>
                    <p class="banner capitalize">manage your items</p>
                </button>

                <button class="text-center" type="button">
                    <div class="flex gap-1 justify-center">
                        <h1 class="cx-font-fam banner">02</h1>
                        <h3 class="cx-font-fam banner uppercase">checkout details</h3>
                    </div>
                    <p class="banner capitalize">confirm your items</p>
                </button>

                <button type="button" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
                    <div class="flex gap-1 justify-center">
                        <h1 class="cx-font-fam banner">03</h1>
                        <h3 class="cx-font-fam banner uppercase">order complete</h3>
                    </div>
                    <p class="banner capitalize">review your order</p>
                </button>
            </div>

            <!-- non mobile -->
            <div class="hidden md:grid grid-cols-3">

                <button (click)="routeCart()" type="button" class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100">
                    <h1 class="cx-font-fam" style="font-size: 50px">01</h1>
                    <div class="my-auto mx-0 text-left">
                        <h3 class="cx-font-fam text-xl uppercase">shopping cart</h3>
                        <p class="text-xs capitalize">manage your items list</p>
                    </div>
                </button>

                <div class="p-3 flex gap-3">
                    <h1 class="cx-font-fam" style="font-size: 50px">02</h1>
                    <div class="my-auto mx-0 text-left">
                        <h3 class="cx-font-fam text-xl uppercase">checkout details</h3>
                        <p class="text-xs capitalize">checkout your items list</p>
                    </div>
                </div>

                <div class="p-3 flex gap-3 cursor-pointer bg-white opacity-50 hover:bg-transparent hover:opacity-100">
                    <h1 class="cx-font-fam" style="font-size: 50px">03</h1>
                    <div class="my-auto mx-0 text-left">
                        <h3 class="cx-font-fam text-xl uppercase">order complete</h3>
                        <p class="text-xs capitalize">review your order</p>
                    </div>
                </div>

            </div>

        </div>

        <!-- contents -->
        <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- shipping div -->
            <div class="p-2">
                <div class="border-b mb-3">
                    <h1 class="uppercase text-sm">
                        contact & shipping information
                    </h1>
                </div>

                <form [formGroup]="form" class="grid grid-cols-1 gap-3">
                    <!-- email and full name -->
                    <div class="grid grid-cols-2 gap-2">
                        <div class="w-full">
                            <h5 class="cs-font md:text-xs uppercase">
                                email <span class="text-red-500">*</span>
                            </h5>
                            <input type="email"
                                   name="email"
                                   formControlName="email"
                                   class="w-full p-2 border"
                                   placeholder="Email">
                        </div>

                        <div class="w-full">
                            <h5 class="cs-font md:text-xs uppercase">
                                full name <span class="text-red-500">*</span>
                            </h5>
                            <input type="text"
                                   name="name"
                                   formControlName="name"
                                   class="w-full p-2 border"
                                   placeholder="Full Name">
                        </div>
                    </div>

                    <!-- phone -->
                    <div class="w-full">
                        <h5 class="cs-font md:text-xs uppercase">
                            phone number <span class="text-red-500">*</span>
                        </h5>
                        <input type="text"
                               name="phone"
                               formControlName="phone"
                               class="w-full p-2 border"
                               placeholder="phone">
                    </div>

                    <!-- address -->
                    <div class="w-full">
                        <h5 class="cs-font md:text-xs uppercase">
                            address <span class="text-red-500">*</span>
                        </h5>
                        <input type="text"
                               name="address"
                               formControlName="address"
                               class="w-full p-2 border"
                               placeholder="address">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <!-- city -->
                        <div class="w-full">
                            <h5 class="cs-font md:text-xs uppercase">
                                city <span class="text-red-500">*</span>
                            </h5>
                            <input type="text"
                                   name="city"
                                   formControlName="city"
                                   class="w-full p-2 border"
                                   placeholder="city">
                        </div>

                        <!-- state -->
                        <div class="w-full">
                            <h5 class="cs-font md:text-xs uppercase">
                                state <span class="text-red-500">*</span>
                            </h5>
                            <input type="text"
                                   name="state"
                                   formControlName="state"
                                   class="w-full p-2 border"
                                   placeholder="state">
                        </div>

                        <!-- postcode -->
                        <div class="w-full">
                            <h5 class="cs-font md:text-xs uppercase">postcode/zipcode</h5>
                            <input type="text"
                                   name="postcode"
                                   formControlName="postcode"
                                   class="w-full p-2 border"
                                   placeholder="postcode/zipcode">
                        </div>
                    </div>

                    <!-- country -->
                    <div class="w-full">
                        <h5 class="cs-font md:text-xs uppercase">
                            country <span class="text-red-500">*</span>
                        </h5>
                        <select class="w-full p-2 border cursor-pointer" formControlName="country">
                            <option value="" disabled selected>country</option>
                            <option>Nigeria</option>
                            <option>United States of America</option>
                            <option>United Kingdom</option>
                            <option>Canada</option>
                        </select>
                    </div>

                    <!-- delivery information -->
                    <div class="w-full">
                        <h5 class="cs-font md:text-xs uppercase">delivery information</h5>
                        <textarea formControlName="deliveryInfo" name="deliveryInfo" class="w-full p-2 border"></textarea>
                    </div>

                </form>
            </div>

            <!-- products div -->
            <div class="p-2 border-l bg-neutral-100">

            </div>

        </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutImplComponent {

  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly carts$ = this.cartService.cart$;

  form = this.fb.group({
    email: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    state: new FormControl("", [Validators.required]),
    postcode: new FormControl(""),
    country: new FormControl("", [Validators.required]),
    deliveryInfo: new FormControl(""),
  });

  /**
   * Routes to cart component
   * */
  routeCart = (): void => { this.router.navigate(['/cart']); }

  currency = (str: string): string => this.cartService.currency(str);


}
