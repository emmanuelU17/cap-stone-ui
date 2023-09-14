import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminDashboardComponent} from "./admin-dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'statistics',
        loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent),
      },
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
        loadComponent: () => import('./updatecollection/update-collection.service').then(m => m.UpdateCollectionService),
      },
      {
        path: 'customer',
        loadComponent: () => import('./customer/customer.component').then(m => m.CustomerComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
