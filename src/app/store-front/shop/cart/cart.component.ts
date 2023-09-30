import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartIconService} from "../../utils/carticon/cart-icon.service";
import {Cart, DUMMY_CART_DETAILS} from "../shop.helper";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  private readonly iconCompService: CartIconService = inject(CartIconService);

  details: Cart[] = DUMMY_CART_DETAILS;

  /** Closes component */
  closeComponent = (): void => {
    this.iconCompService.close = false;
  }

}
