import { Routes } from '@angular/router';
import { AdminGuard } from './admin-guard';

export const route: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/admin-authentication.component').then(
        (m) => m.AdminAuthenticationComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    loadChildren: () =>
      import('./dashboard/admin-dashboard.routes').then((m) => m.routes),
    canActivateChild: [AdminGuard],
  },
];
