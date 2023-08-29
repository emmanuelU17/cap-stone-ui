import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthMenuComponent} from "../authmenu/auth-menu.component";
import {DashboardService} from "../dashboard.service";
import {Observable} from "rxjs";
import {AuthResponse} from "../../../../global-utils/global-utils";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, AuthMenuComponent],
  templateUrl: './navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  principal$: Observable<AuthResponse>;

  constructor(private dashboardService: DashboardService) {
    this.principal$ = this.dashboardService._principal$.pipe();
  }

}
