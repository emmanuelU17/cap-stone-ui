import {Routes} from "@angular/router";
import {checkoutGuard} from "./payment/checkout/checkout.guard";

export const route: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent),
    loadChildren: () => import('./shop/shop.routes').then(m => m.SHOP_ROUTES),
  },
  {
    path: 'account',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    loadChildren: () => import('./profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'pages',
    loadComponent: () => import('./pages/pages.component').then(m => m.PagesComponent),
    loadChildren: () => import('./pages/pages.route').then(m => m.PAGES_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('./payment/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./payment/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [checkoutGuard]
  }
];
