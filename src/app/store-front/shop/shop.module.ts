import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShopRoutingModule} from './shop-routing.module';
import {CollectionComponent} from './collection/collection.component';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {UtilsModule} from "../utils/utils.module";

@NgModule({
  declarations: [
    CollectionComponent,
    CategoryComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ReactiveFormsModule,
    RouterLink,
    // UtilsModule,
    RouterLink,
    UtilsModule,
  ]
})
export class ShopModule { }
