import {Routes} from "@angular/router";
import {checkoutGuard} from "./checkout/checkout.guard";
import {importProvidersFrom} from "@angular/core";
import {Angular4PaystackModule} from "angular4-paystack";

export const route: Routes = [
  {
    path: '',
    loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent),
    providers: [importProvidersFrom(Angular4PaystackModule.forRoot('pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'))]
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [checkoutGuard]
  }
];
