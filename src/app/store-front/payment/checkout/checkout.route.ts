import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout-impl.component').then(m => m.CheckoutImplComponent)
  },
]
