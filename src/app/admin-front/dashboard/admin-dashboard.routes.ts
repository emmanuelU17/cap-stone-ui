import {Routes} from "@angular/router";

export const ADMIN_DASHBOARD_ROUTES: Routes = [

  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent),
  },

  // Product
  {
    path: 'new-product',
    loadComponent: () => import('./newproduct/new-product.component').then(m => m.NewProductComponent),
  },
  {
    path: 'product',
    loadComponent: () => import('./product/product.component').then(m => m.ProductComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./updateproduct/update-product.component').then(m => m.UpdateProductComponent),
  },

  // Category
  {
    path: 'new-category',
    loadComponent: () => import('./newcategory/new-category.component').then(m => m.NewCategoryComponent),
  },
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./updatecategory/update-category.component').then(m => m.UpdateCategoryComponent),
  },

  // Collection
  {
    path: 'new-collection',
    loadComponent: () => import('./newcollection/new-collection.component').then(m => m.NewCollectionComponent),
  },
  {
    path: 'collection',
    loadComponent: () => import('./collection/collection.component').then(m => m.CollectionComponent),
  },
  {
    path: 'collection/:id',
    loadComponent: () => import('./updatecollection/update-collection.component').then(m => m.UpdateCollectionComponent),
  },

  // Customer
  {
    path: 'customer',
    loadComponent: () => import('./customer/customer.component').then(m => m.CustomerComponent),
    loadChildren: () => import('./customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },

  // Path matcher
  {
    path: '',
    redirectTo: 'statistics',
    pathMatch: 'full'
  }
];
