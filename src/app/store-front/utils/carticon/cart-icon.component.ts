import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartIconService} from "./cart-icon.service";
import {CartComponent} from "../../shop/cart/cart.component";

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, CartComponent],
  templateUrl: './cart-icon.component.html',
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
