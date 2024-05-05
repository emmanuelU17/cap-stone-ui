import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-checkout-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrls: ['../order.component.css'],
  template: `
    <div class="p-2 mb-2 md:p-4 md:mb-3 bg-neutral-100">
      <!-- mobile -->
      <div class="grid grid-cols-3 sm:hidden">
        <a
          routerLink="/order/cart"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="text-center bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="flex justify-center">
            <h1
              class="cx-font-fam uppercase banner"
              style="font-size: calc(10px + 1vw)"
            >
              01 cart
            </h1>
          </div>
        </a>

        <a
          routerLink="/order/checkout"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="text-center bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="flex justify-center">
            <h1
              class="cx-font-fam banner uppercase"
              style="font-size: calc(10px + 1vw);"
            >
              02 checkout
            </h1>
          </div>
        </a>

        <a
          routerLink="/order"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="text-center bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="flex justify-center">
            <h1
              class="cx-font-fam banner uppercase"
              style="font-size: calc(10px + 1vw);"
            >
              03 payment
            </h1>
          </div>
        </a>
      </div>

      <!-- non mobile -->
      <div class="hidden sm:grid grid-cols-3">
        <a
          routerLink="/order/cart"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="h-full flex items-center">
            <h1 class="cx-font-fam" style="font-size: 50px">01</h1>
          </div>
          <div class="my-auto mx-0 text-left">
            <h3 class="cx-font-fam text-xl uppercase">shopping cart</h3>
            <p class="text-xs capitalize">manage your items list</p>
          </div>
        </a>

        <a
          routerLink="/order/checkout"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="h-full flex items-center">
            <h1 class="cx-font-fam" style="font-size: 50px">02</h1>
          </div>
          <div class="my-auto mx-0 text-left">
            <h3 class="cx-font-fam text-xl uppercase">checkout details</h3>
            <p class="text-xs capitalize">checkout your items list</p>
          </div>
        </a>

        <a
          routerLink="/order"
          routerLinkActive="active-r"
          [routerLinkActiveOptions]="{ exact: true }"
          class="p-3 flex gap-3 bg-white opacity-50 hover:bg-transparent hover:opacity-100"
        >
          <div class="h-full flex items-center">
            <h1 class="cx-font-fam" style="font-size: 50px">03</h1>
          </div>
          <div class="my-auto mx-0 text-left">
            <h3 class="cx-font-fam text-xl uppercase">payment details</h3>
            <p class="text-xs capitalize">confirm your order</p>
          </div>
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutNavComponent {}
