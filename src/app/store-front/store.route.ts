import {Routes} from "@angular/router";

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
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    loadChildren: () => import('./checkout/checkout.route').then(m => m.routes)
  }
];
