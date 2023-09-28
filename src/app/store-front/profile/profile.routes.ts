import {Routes} from '@angular/router';
import {userDashBoardGuard} from "./userguard";

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [userDashBoardGuard]
  },
  {
    path: 'authentication',
    loadComponent: () => import('./auth/store-front-auth.component').then(m => m.StoreFrontAuthComponent),
  }
];
