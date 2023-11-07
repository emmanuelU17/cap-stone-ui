import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard} from "./admin-front/admin-guard";
import {ADMIN_DASHBOARD_ROUTES} from "./admin-front/dashboard/admin-dashboard.routes";

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
        loadComponent: () => import('./store-front/shop/shop.component').then(m => m.ShopComponent),
        loadChildren: () => import('./store-front/shop/shop.routes').then(m => m.SHOP_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () => import('./store-front/profile/profile.component').then(m => m.ProfileComponent),
        loadChildren: () => import('./store-front/profile/profile.routes').then(m => m.PROFILE_ROUTES)
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
        children: ADMIN_DASHBOARD_ROUTES,
        canActivateChild: [AdminGuard],
      }
    ]
  },

  // Error
  {
    path: '404',
    loadComponent: () => import('./store-front/utils/pagenotfound/page-not-found.component')
      .then(m => m.PageNotFoundComponent)
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
