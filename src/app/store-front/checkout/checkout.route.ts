import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
  }
]
