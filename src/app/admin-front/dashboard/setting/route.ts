import { Routes } from '@angular/router';

export const route: Routes = [
  {
    path: 'shipping',
    loadComponent: () =>
      import('./shipping/shipping.component').then((m) => m.ShippingComponent),
  },
  {
    path: 'tax',
    loadComponent: () =>
      import('./tax/tax.component').then((m) => m.TaxComponent),
  },
  {
    path: '',
    redirectTo: 'shipping',
    pathMatch: 'full',
  },
];
