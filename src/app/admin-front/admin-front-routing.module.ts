import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {authGuard} from "./authguard";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/admin-authentication.component').then(m => m.AdminAuthenticationComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivateChild: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminFrontRoutingModule { }
