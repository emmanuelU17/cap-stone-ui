import { Route } from '@angular/router';

export const ACCOUNT_DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
