import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent),
  },
  // Product
  {
    path: 'product',
    loadComponent: () => import('./product/product.component').then(m => m.ProductComponent),
    loadChildren: () => import('./product/product-route').then(m => m.routes)
  },
  // Category
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
    loadChildren: () => import('./category/category-routes').then(m => m.routes)
  },
  // Customer
  {
    path: 'customer',
    loadComponent: () => import('./customer/customer.component').then(m => m.CustomerComponent),
    loadChildren: () => import('./customer/customer.routes').then(m => m.routes)
  },
  // setting
  {
    path: 'setting',
    loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent),
    loadChildren: () => import('./setting/route').then(m => m.route)
  },
  // Path matcher
  {
    path: '',
    redirectTo: 'statistics',
    pathMatch: 'full'
  }
];
