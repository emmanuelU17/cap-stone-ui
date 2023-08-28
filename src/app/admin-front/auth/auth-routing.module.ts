import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminAuthenticationComponent} from "./adminauthentication/admin-authentication.component";

const routes: Routes = [
  {
    path: '',
    component: AdminAuthenticationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
