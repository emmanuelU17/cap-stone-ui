import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminAuthenticationComponent} from './adminauthentication/admin-authentication.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthRoutingModule} from "./auth-routing.module";
import {DirectiveModule} from "../../directive/directive.module";

@NgModule({
  declarations: [AdminAuthenticationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    DirectiveModule
  ]
})
export class AdminAuthModule {

  constructor() { }

}
