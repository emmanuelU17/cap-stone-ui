import {Routes} from "@angular/router";

export const ADMIN_PRODUCT_ROUTES: Routes = [
  {
    path: 'new-product',
    loadComponent: () => import('../newproduct/new-product.component')
      .then(m => m.NewProductComponent),
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./updateproduct/update-product.component').then(m => m.UpdateProductComponent),
  // },
]
