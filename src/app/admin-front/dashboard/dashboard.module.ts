import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './component/dashboard.component';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {NavigationComponent} from "./navigation/navigation.component";
import {MatIconModule} from "@angular/material/icon";
import {ProductComponent} from "./product/product.component";
import {CategoryComponent} from "./category/category.component";
import {CustomerComponent} from "./customer/customer.component";
import {FooterComponent} from "./footer/footer.component";
import {NewCategoryComponent} from "./newcategory/new-category.component";
import {NewProductComponent} from "./newproduct/new-product.component";
import {NewCollectionComponent} from "./newcollection/new-collection.component";
import {CollectionComponent} from "./collection/collection.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {RegisterComponent} from "./register/register.component";
import {AuthMenuComponent} from "./authmenu/auth-menu.component";
import {DirectiveModule} from "../../directive/directive.module";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavigationComponent,
    MatIconModule,
    ProductComponent,
    CategoryComponent,
    CustomerComponent,
    FooterComponent,
    NewCategoryComponent,
    NewProductComponent,
    NewCollectionComponent,
    CollectionComponent,
    StatisticsComponent,
    RegisterComponent,
    AuthMenuComponent,
    DirectiveModule
  ]
})
export class DashboardModule { }
