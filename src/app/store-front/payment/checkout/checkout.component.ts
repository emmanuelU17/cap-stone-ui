import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CartService} from "../cart/cart.service";
import {FooterService} from "../../utils/footer/footer.service";
import {map, switchMap} from "rxjs";
import {PaymentService} from "../payment.service";
import {ReservationDTO} from "../index";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
          <a routerLink="/cart'" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="flex gap-1 justify-center">
              <h1 class="cx-font-fam uppercase banner">01 shopping cart</h1>
            </div>
            <p class="banner capitalize">manage your items</p>
          </a>
          <button class="text-center" type="button">
            <div class="flex gap-1 justify-center">
              <h1 class="cx-font-fam banner uppercase">02 checkout details</h1>
            </div>
            <p class="banner capitalize">confirm your items</p>
          </button>
          <button type="button" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="flex gap-1 justify-center">
              <h1 class="cx-font-fam banner uppercase">03 payment details</h1>
            </div>
            <p class="banner capitalize">confirm your order</p>
          </button>
        </div>

        <!-- non mobile -->
        <div class="hidden md:grid grid-cols-3">
          <button routerLink="/cart" class="p-3 flex gap-3 opacity-50 bg-white hover:bg-transparent hover:opacity-100">
            <div class="h-full flex items-center">
              <h1 class="cx-font-fam" style="font-size: 50px">01</h1>
            </div>
            <div class="my-auto mx-0 text-left">
              <h3 class="cx-font-fam text-xl uppercase">shopping cart</h3>
              <p class="text-xs capitalize">manage your items list</p>
            </div>
          </button>
          <div class="p-3 flex gap-3">
            <div class="h-full flex items-center">
              <h1 class="cx-font-fam" style="font-size: 50px">02</h1>
            </div>
            <div class="my-auto mx-0 text-left">
              <h3 class="cx-font-fam text-xl uppercase">checkout details</h3>
              <p class="text-xs capitalize">checkout your items list</p>
            </div>
          </div>

          <div class="p-3 flex gap-3 cursor-pointer bg-white opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="h-full flex items-center">
              <h1 class="cx-font-fam" style="font-size: 50px">03</h1>
            </div>
            <div class="my-auto mx-0 text-left">
              <h3 class="cx-font-fam text-xl uppercase">payment details</h3>
              <p class="text-xs capitalize">confirm your order</p>
            </div>
          </div>
        </div>
      </div>

      <!-- contents -->
      <div class="p-1 md:p-3 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <!-- shipping div -->
        <div class="md:p-2">
          <div class="border-b mb-3">
            <h1 class="uppercase cs-font md:text-sm">
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
                <h5 class="cs-font md:text-xs uppercase">postalcode/zipcode</h5>
                <input type="text"
                       name="postcode"
                       formControlName="postcode"
                       class="w-full p-2 border"
                       placeholder="postalcode/zipcode">
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

            <div class="w-full flex justify-end text-sm md:text-base">
              <a (click)="onAddressEntered()"
                 routerLink="/payment"
                 class="p-2 text-white hover:text-black bg-black hover:bg-[var(--app-theme-hover)]"
                 [style]="{ 'display': form.valid ? 'block' : 'none' }"
              >
                Continue to payment
              </a>
            </div>

          </form>
        </div>

        <!-- products div -->
        <div class="p-2 max-h-[500px] overflow-y-auto border-l bg-neutral-100">

          <div class="pb-4">
            <ul role="list" class="relative -my-6 divide-y divide-gray-200">
              <li class="flex pt-6 pb-3" *ngFor="let detail of carts$ | async; let i = index">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img [src]="detail.url" alt="product image{{ i }}" class="h-full w-full object-cover object-center">
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                  <div class="md:mb-2 flex flex-col md:flex-row md:justify-between text-base font-medium text-gray-900">
                    <h3 class="cs-font">
                      {{ detail.product_name }}
                    </h3>
                    <p class="cs-font ml-4">{{ currency(detail.currency) }}{{ detail.price }}</p>
                  </div>
                  <!-- mobile -->
                  <div class="cs-font md:hidden">
                    <div class="grid grid-cols-2">
                      <div class="">
                        <h5 class="w-fit border-b font-bold">size</h5>
                        <p class="text-gray-500">{{ detail.size }}</p>
                      </div>
                      <div class="">
                        <h5 class="w-fit border-b font-bold">quantity</h5>
                        <p class="text-gray-500">{{ detail.qty }}</p>
                      </div>
                    </div>

                    <div class="w-full pt-1">
                      <h5 class="w-fit border-b font-bold">colour</h5>
                      <p class="mt-1 text-gray-500">{{ detail.colour }}</p>
                    </div>

                  </div>
                  <!-- none mobile -->
                  <div class="hidden md:grid grid-cols-3 text-xs">

                    <div class="border-r-2">
                      <h5 class="border-b font-bold">colour</h5>
                      <p class="mt-1 text-sm text-gray-500">{{ detail.colour }}</p>
                    </div>

                    <div class="border-r-2 text-center">
                      <h5 class="border-b font-bold">size</h5>
                      <p class="text-gray-500">{{ detail.size }}</p>
                    </div>

                    <div class="border-r-2">
                      <h5 class="border-b text-right font-bold">quantity</h5>
                      <p class="text-gray-500 text-right">{{ detail.qty }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <!-- subtotal -->
            <div class="cs-font py-1 flex justify-between md:text-sm">
              <h3 class="capitalize">subtotal</h3>
              <h3 class="capitalize" *ngIf="total$ | async as total">
                {{ total.currency }}{{ total.total }}
              </h3>
            </div>

            <!-- shipping -->
            <div class="cs-font py-1 flex justify-between md:text-xs">
              <h3 class="capitalize">shipping</h3>
              <h3 class="capitalize">$15.00</h3>
            </div>

            <!-- taxes -->
            <div class="cs-font py-1 flex justify-between md:text-sm">
              <h3 class="capitalize">taxes</h3>
              <h3>$2.00</h3>
            </div>

            <!-- total -->
            <div class="cs-font py-1 flex justify-between font-semibold md:text-sm">
              <h3 class="capitalize">total</h3>
              <h3 class="uppercase"><span style="font-size: 8px">USD</span> $50.00</h3>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {

  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);
  private readonly footService = inject(FooterService);
  private readonly fb = inject(FormBuilder);

  readonly carts$ = this.cartService.cart$;

  // TODO api call to receive shipping price based on location and tax
  readonly total$ = this.footService.currency$
    .pipe(
      switchMap((currency) => this.cartService.total$
        .pipe(map((num) => ({ total: num, currency: currency })))
      )
    );

  readonly form = this.fb.group({
    email: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required, Validators.maxLength(255)]),
    city: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    state: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    postcode: new FormControl("",[Validators.maxLength(10)]),
    country: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    deliveryInfo: new FormControl("", [Validators.maxLength(1000)]),
  });

  currency = (str: string): string => this.footService.currency(str);

  onAddressEntered(): void {
    const email = this.form.controls['email'].value;
    const name = this.form.controls['name'].value;
    const phone = this.form.controls['phone'].value;
    const address = this.form.controls['address'].value;
    const city = this.form.controls['city'].value;
    const state = this.form.controls['state'].value;
    const country = this.form.controls['country'].value;

    if (!email || !name || !phone || !address || !city || !state || !country) {
      this.paymentService.toast('please enter your shipping information');
      return;
    }

    const postcode = this.form.controls['postcode'].value;
    const deliveryInfo = this.form.controls['deliveryInfo'].value;

    const dto: ReservationDTO = {
      email: email,
      name: name,
      phone: phone,
      address: address,
      city: city,
      state: state,
      postcode: !postcode ? '' : postcode,
      country: country,
      deliveryInfo: !deliveryInfo ? '' : deliveryInfo
    };

    this.paymentService.setAddress(dto);
  }

}
