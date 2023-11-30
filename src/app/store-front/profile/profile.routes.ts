import {Routes} from '@angular/router';
import {userDashBoardGuard} from "./userguard";

export const PROFILE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    loadChildren: () => import('./dashboard/dash.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [userDashBoardGuard]
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
