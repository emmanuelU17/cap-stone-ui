import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./category-impl/category-impl.component').then(m => m.CategoryImplComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new-category.component').then(m => m.NewCategoryComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./update/update-category.component').then(m => m.UpdateCategoryComponent),
  }
]
