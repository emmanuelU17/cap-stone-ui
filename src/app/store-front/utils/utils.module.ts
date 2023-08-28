import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {CardComponent} from './card/card.component';
import {NavigationComponent} from './navigation/navigation.component';
import {PageNotFoundComponent} from './pagenotfound/page-not-found.component';
import {RouterLink} from "@angular/router";
import {AppComponent} from "../../app.component";

@NgModule({
  declarations: [
    FilterComponent,
    CardComponent,
    NavigationComponent,
    PageNotFoundComponent,
    AppComponent
  ],
  exports: [
    NavigationComponent,
    CardComponent,
    FilterComponent,
    AppComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
  ]
})
export class UtilsModule { }
