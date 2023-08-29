import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./store-front/utils/pagenotfound/page-not-found.component";

const routes: Routes = [
  { path: 'admin',  loadChildren: () => import('./admin-front/admin-front.module').then(m => m.AdminFrontModule) },
  { path: '', loadChildren: () => import('./store-front/store-front.module').then(m => m.StoreFrontModule) },
  { path: '404',  component: PageNotFoundComponent },
  { path: '**',  redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
