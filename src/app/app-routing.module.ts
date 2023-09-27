import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./store-front/utils/pagenotfound/page-not-found.component";
import {adminFrontAuthGuard} from "./admin-front/admin-front-auth-guard";

const routes: Routes = [
  // Store-front
  {
    path: '',
    loadComponent: () => import('./store-front/store.component').then(m => m.StoreComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./store-front/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'shop',
        loadChildren: () => import('./store-front/shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./store-front/profile/profile.module').then(m => m.ProfileModule)
      },
    ]
  },

  // Admin front
  {
    path: 'admin',
    loadComponent: () => import('./admin-front/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-front/auth/admin-authentication.component')
          .then(m => m.AdminAuthenticationComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-front/dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent),
        canActivateChild: [adminFrontAuthGuard],
        loadChildren: () => import('./admin-front/dashboard/admin-dashboard.routes')
          .then(m => m.ADMIN_DASHBOARD_ROUTES),
        // children: ADMIN_DASHBOARD_ROUTES
      }
    ]
  },

  // Error
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
