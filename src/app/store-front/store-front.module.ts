import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreFrontRoutingModule} from './store-front-routing.module';
import {StoreFrontNavigationComponent} from "./utils/navigation/store-front-navigation.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreFrontRoutingModule,
    StoreFrontNavigationComponent
  ],
})
export class StoreFrontModule { }
