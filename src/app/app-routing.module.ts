import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Store-front
  {
    path: '',
    loadComponent: () =>
      import('./store-front/store.component').then((m) => m.StoreComponent),
    loadChildren: () =>
      import('./store-front/store.route').then((m) => m.route),
  },

  // Admin front
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin-front/admin.component').then((m) => m.AdminComponent),
    loadChildren: () =>
      import('./admin-front/admin-routes').then((m) => m.route),
  },

  // Error
  {
    path: '404',
    loadComponent: () =>
      import(
        './store-front/utils/page-not-found/page-not-found.component'
      ).then((m) => m.PageNotFoundComponent),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
