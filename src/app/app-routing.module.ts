import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./store-front/utils/pagenotfound/page-not-found.component";
import {StoreComponent} from "./store-front/store.component";
import {AdminComponent} from "./admin-front/admin.component";

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    loadChildren: () => import('./store-front/store-front.module').then(m => m.StoreFrontModule),
  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import('./admin-front/admin-front.module').then(m => m.AdminFrontModule),
  },
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
