import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShopRoutingModule} from './shop-routing.module';
import {CollectionComponent} from './collection/collection.component';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CardComponent} from "../utils/card/card.component";
import {FilterComponent} from "../utils/filter/filter.component";

@NgModule({
  declarations: [],
  imports: [ShopRoutingModule]
})
export class ShopModule { }
