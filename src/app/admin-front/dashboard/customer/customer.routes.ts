import {Routes} from "@angular/router";

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./listcustomer/list-customer.component').then(m => m.ListCustomerComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
  },
];

export interface RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}
