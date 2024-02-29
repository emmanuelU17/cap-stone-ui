import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Angular4PaystackModule} from "angular4-paystack";
import {PaymentService} from "./payment.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, Angular4PaystackModule, RouterLink],
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

          <a routerLink="/order/cart" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="flex justify-center">
              <h1 class="cx-font-fam uppercase banner">01 shopping cart</h1>
            </div>
            <p class="banner capitalize">manage your items</p>
          </a>

          <a routerLink="/order/checkout" class="text-center opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="flex justify-center">
              <h1 class="cx-font-fam banner uppercase">02 checkout details</h1>
            </div>
            <p class="banner capitalize">confirm your items</p>
          </a>

          <button type="button" class="text-center">
            <div class="flex justify-center">
              <h1 class="cx-font-fam banner uppercase">03 payment details</h1>
            </div>
            <p class="banner capitalize">confirm your order</p>
          </button>
        </div>

        <!-- non mobile -->
        <div class="hidden md:grid grid-cols-3">

          <a routerLink="/order/cart" class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="h-full flex items-center">
              <h1 class="cx-font-fam" style="font-size: 50px">01</h1>
            </div>
            <div class="my-auto mx-0 text-left">
              <h3 class="cx-font-fam text-xl uppercase">shopping cart</h3>
              <p class="text-xs capitalize">manage your items list</p>
            </div>
          </a>

          <a routerLink="/order/checkout"
             class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100">
            <div class="h-full flex items-center">
              <h1 class="cx-font-fam" style="font-size: 50px">02</h1>
            </div>
            <div class="my-auto mx-0 text-left">
              <h3 class="cx-font-fam text-xl uppercase">checkout details</h3>
              <p class="text-xs capitalize">checkout your items list</p>
            </div>
          </a>

          <div class="p-3 flex gap-3">
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

      <!-- content -->
      <div class="p-1 md:p-2">
        @if (address$ | async; as address) {
          @if (raceCondition$ | async; as dto) {
            <!-- shipping div -->
            <div class="w-fit mb-3 border-b border-black">
              <h1 class="uppercase cs-font md:text-sm">
                confirm contact & shipping information
              </h1>
            </div>

            <div class="pb-3">
              <!-- email -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  email
                </h2>
                <h4 class="cs-font">{{ address.email }}</h4>
              </div>

              <!-- name -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  name
                </h2>
                <h4 class="cs-font">{{ address.name }}</h4>
              </div>

              <!-- phone -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  phone
                </h2>
                <h4 class="cs-font">{{ address.phone }}</h4>
              </div>

              <!-- address -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  address
                </h2>
                <h4 class="cs-font">{{ address.address }}</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <!-- city -->
                <div class="w-full">
                  <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                    city
                  </h2>
                  <h4 class="cs-font">{{ address.city }}</h4>
                </div>

                <!-- state -->
                <div class="w-full">
                  <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                    state
                  </h2>
                  <h4 class="cs-font">{{ address.state }}</h4>
                </div>

                <!-- postcode -->
                <div class="w-full">
                  <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                    postcode/zipcode
                  </h2>
                  <h4 class="cs-font">{{ address.postcode }}</h4>
                </div>
              </div>

              <!-- country -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  country
                </h2>
                <h4 class="cs-font">{{ address.country }}</h4>
              </div>

              <!-- delivery information -->
              <div class="w-full">
                <h2 class="cs-font w-fit border-b border-black uppercase md:text-xs">
                  delivery information
                </h2>
                <div class="max-h-36 overflow-y-auto opacity-50 bg-white">
                  <p class="cs-font text-black">{{ address.deliveryInfo }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <div class="w-fit p-2 bg-black text-white">
                <angular4-paystack
                  [email]="address.email"
                  [key]="dto.pub_key"
                  [amount]="dto.total"
                  [ref]="dto.reference"
                  [metadata]="address"
                  [currency]="dto.currency"
                  [channels]="['card']"
                  [class]="'btn btn-primary'"
                  (onClose)="paymentCancel()"
                  (callback)="paymentDone($event)"
                >
                  PAY {{ dto.currency }}{{ dto.total }}
                </angular4-paystack>
              </div>
            </div>

          } @else {
            <div class="flex flex-col justify-center items-center">
              <div role="status"
                   class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-[var(--app-theme)] align-[-0.125em] ext-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          }
        } @else {
          <div class="flex flex-col justify-center items-center">
            <div role="status"
                 class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-[var(--app-theme)] align-[-0.125em] ext-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent {

  private readonly paymentService = inject(PaymentService);

  readonly address$ = this.paymentService.address$;
  readonly raceCondition$ = this.paymentService.validate();

  paymentInit(): void {
    console.log('Payment initialized');
  }

  paymentDone(ref: any): void {
    console.log('Payment done ', ref);
  }

  paymentCancel(): void {
    console.log('payment failed');
  }

}
