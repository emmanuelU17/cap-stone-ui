import {Route} from "@angular/router";

export const PROFILE_DASHBOARD_ROUTES: Route[] = [
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component')
      .then(m => m.OverviewComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-history/order-history.component')
      .then(m => m.OrderHistoryComponent)
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  }
];
