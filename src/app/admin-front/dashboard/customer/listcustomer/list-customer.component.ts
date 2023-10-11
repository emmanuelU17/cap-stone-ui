import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {DynamicTableComponent} from "../../dynamictable/dynamic-table.component";
import {CustomerService} from "../customer.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {Page, SarreUser} from "../../../../global-utils";
import {TableContent} from "../../../shared-util";

@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicTableComponent],
  templateUrl: './list-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListCustomerComponent {

  private readonly customerService = inject(CustomerService);

  thead: Array<keyof SarreUser> = ['firstname', 'lastname', 'email', 'phone'];

  users$: Observable<{
    state: string,
    error?: string,
    data?: Page<SarreUser>
  }> = this.customerService.allUsers()
    .pipe(
      map((page) => ({ state: 'LOADED', data: page })),
      startWith({ state: 'loading...' }),
      catchError((err) => of({ state: 'ERROR', error: err.error.message}))
    );

  infoFromTableComponent(user: TableContent<SarreUser>): void {
    console.log('User ', user);
  }

}
