import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from "./product/product.component";
import {CollectionComponent} from "./collection/collection.component";
import {CategoryComponent} from "./category/category.component";

const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'collection',
    component: CollectionComponent
  },
  {
    path: ':path/product/:id',
    component: ProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
