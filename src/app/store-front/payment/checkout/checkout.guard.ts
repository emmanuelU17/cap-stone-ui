import {inject} from "@angular/core";
import {CartService} from "../cart/cart.service";
import {Router} from "@angular/router";
import {SarreCurrency} from "../../../global-utils";
import {tap} from "rxjs";

export const checkoutGuard = () => {
  const service = inject(CartService);
  const route = inject(Router);
  return service.cartItems(SarreCurrency.NGN)
    .pipe(
      tap((cart): void => {
        console.log('Cart ', cart);
        if (cart && cart.length < 1) {
          route.navigate(['/cart']);
        }
      })
    );
}