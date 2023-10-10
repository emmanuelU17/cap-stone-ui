import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartIconService} from "../../utils/carticon/cart-icon.service";
import {Cart} from "../shop.helper";
import {map, Observable, of} from "rxjs";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  private readonly service: CartIconService = inject(CartIconService);

  // details: Cart[] = DUMMY_CART_DETAILS;
  private cart: Cart[] = this.service.items();
  details$ = this.service.carts$;
  currency = this.cart.length > 0 ? this.cart[0].currency : '';

  /** Closes component */
  closeComponent = (): void => {
    this.service.close = false;
  }

  remove(sku: string): void {
    this.service.removeItem(sku);
  }

  total = (): Observable<number> => {
    return this.details$.pipe(
      map((carts) => {
        let sum = 0;
        carts.forEach(cart => sum += (cart.qty * cart.price));

        return sum;
      })
    );
  }

  checkout(): void {
    console.log('Checkout clicked ')
  }

}
