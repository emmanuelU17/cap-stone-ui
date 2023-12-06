import {Routes} from '@angular/router';
import {CLIENT_DASHBOARD_GUARD} from "./route.guard";

export const PROFILE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    loadChildren: () => import('./dashboard/dash.routes').then(m => m.PROFILE_DASHBOARD_ROUTES),
    canActivateChild: [CLIENT_DASHBOARD_GUARD]
  },
  {
    path: 'authentication',
    loadComponent: () => import('./auth/store-front-auth.component').then(m => m.StoreFrontAuthComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
