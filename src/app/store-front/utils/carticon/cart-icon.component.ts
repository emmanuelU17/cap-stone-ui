import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartIconService} from "./cart-icon.service";
import {CartComponent} from "../../shop/cart/cart.component";

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, CartComponent],
  template: `
    <button (click)="onOpenCartComponent()" class="flex uppercase">
      <svg xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           stroke-width="1.5"
           stroke="currentColor"
           class="w-6 h-6 cursor-pointer text-[var(--app-theme)]">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
      </svg>
      <span class="text-xs text-red-600"
            *ngIf="count$ | async as count"
            [style]="{ 'display': count > 0 ? 'block' : 'none'  }"
      >{{ count }}</span>
    </button>

    <!-- Cart component -->
    <div class="z-15 flex fixed top-0 right-0 bottom-0 left-0"
         *ngIf="openComponent$ | async as open"
         [style]="{ 'display': open ? 'flex' : 'none' }"
    >
      <div class="flex-1 bg-black opacity-50 hidden sm:block"></div>
      <div class="w-full sm:w-1/2 lg:w-1/4">
        <app-cart></app-cart>
      </div>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconComponent {

  private readonly service = inject(CartIconService);

  count$ = this.service.count$;
  openComponent$ = this.service.onOpenCartComponent$

  /** Opens Cart component */
  onOpenCartComponent = (): void => {
    this.service.close = true
  }

}
