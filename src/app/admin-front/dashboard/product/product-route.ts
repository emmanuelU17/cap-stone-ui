import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-impl/product-impl.component').then(m => m.ProductImplComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new-product.component').then(m => m.NewProductComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./update/update-product.component').then(m => m.UpdateProductComponent),
  },
]
