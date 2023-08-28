import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {AuthMenuService} from "./auth-menu.service";
import {DirectiveModule} from "../../../directive/directive.module";

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatMenuModule, DirectiveModule],
  templateUrl: './auth-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthMenuComponent {
  @Input() principal: string = '';

  constructor(private authMenuService: AuthMenuService, private router: Router) { }

  /** Method logs out a user and then redirects back to auth component if status is 200 */
  logout(): Observable<number> {
    return this.authMenuService.logoutApi().pipe(tap(() => this.router.navigate(['/admin'])));
  }
}
