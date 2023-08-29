import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import {StoreFrontAuthComponent} from './auth/store-front-auth.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    StoreFrontAuthComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
