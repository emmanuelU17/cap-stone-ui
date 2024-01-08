import {Routes} from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: ':path/product/:id',
    loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
  },
  // Path matcher
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  }
];
