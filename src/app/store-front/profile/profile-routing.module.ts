import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {userDashBoardGuard} from "./userguard";

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
