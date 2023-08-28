import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.module').then(m => m.StoreFrontModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-front/admin-front.module').then(m => m.AdminFrontModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
