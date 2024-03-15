import {inject} from "@angular/core";
import {CartService} from "../cart/cart.service";
import {Router} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {FooterService} from "@/app/store-front/utils/footer/footer.service";

export const checkoutGuard = () => {
  const footer = inject(FooterService);
  const service = inject(CartService);
  const route = inject(Router);
  return footer.currency$
    .pipe(
      switchMap((currency) => service.cartItems(currency)
        .pipe(
          tap((cart): void => {
            if (cart && cart.length < 1)
              route.navigate(['/order/cart'])
          })
        )
      )
    );
}
