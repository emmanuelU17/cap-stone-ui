import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {AuthMenuService} from "./auth-menu.service";
import {DirectiveModule} from "../../../directive/directive.module";

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, DirectiveModule],
  templateUrl: './auth-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthMenuComponent {
  private authMenuService: AuthMenuService = inject(AuthMenuService);
  private router: Router = inject(Router);

  @Input() principal: string = '';

  /** Method logs out a user and then redirects back to auth component if status is 200 */
  logout(): Observable<number> {
    return this.authMenuService.logoutApi()
      .pipe(tap(() => this.router.navigate(['/admin'])));
  }
}
