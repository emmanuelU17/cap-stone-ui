import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart-impl.component').then(m => m.CartImplComponent)
  },
]
