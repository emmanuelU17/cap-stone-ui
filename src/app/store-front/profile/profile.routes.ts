import {Routes} from '@angular/router';
import {CLIENT_DASHBOARD_GUARD} from "./profile.guard";

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/account.component').then(m => m.AccountComponent),
    loadChildren: () => import('./dashboard/account.routes').then(m => m.ACCOUNT_DASHBOARD_ROUTES),
    canActivateChild: [CLIENT_DASHBOARD_GUARD]
  },
  {
    path: 'authentication',
    loadComponent: () => import('./auth/store-front-auth.component').then(m => m.StoreFrontAuthComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
