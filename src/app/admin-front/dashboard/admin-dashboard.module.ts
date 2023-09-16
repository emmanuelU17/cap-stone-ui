import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminDashboardComponent} from "./admin-dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {NavigationComponent} from "./navigation/navigation.component";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from "./footer/footer.component";
import {AuthMenuComponent} from "./authmenu/auth-menu.component";
import {DirectiveModule} from "../../directive/directive.module";

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavigationComponent,
    MatIconModule,
    FooterComponent,
    AuthMenuComponent,
    DirectiveModule
  ]
})
export class AdminDashboardModule { }
