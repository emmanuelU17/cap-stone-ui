import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CsrfInterceptor} from "./service/csrf-interceptor.service";
import {StoreFrontNavigationComponent} from "./store-front/utils/navigation/store-front-navigation.component";
import {PageNotFoundComponent} from "./store-front/utils/pagenotfound/page-not-found.component";
import { StoreComponent } from './store-front/store.component';
import { AdminComponent } from './admin-front/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreFrontNavigationComponent,
    PageNotFoundComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
