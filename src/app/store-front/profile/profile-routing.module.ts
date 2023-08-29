import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StoreFrontAuthComponent} from "./auth/store-front-auth.component";
import {userDashBoardGuard} from "./userguard";

const routes: Routes = [
  { path: '',  component: DashboardComponent,  canActivate: [userDashBoardGuard] },
  { path: 'authentication',  component: StoreFrontAuthComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
