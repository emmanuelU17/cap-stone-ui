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
  template: `
    <button
      type="button"
      class="h-8 w-8 rounded-full cursor-pointer border-none outline-none m-auto bg-[var(--app-theme)]"
      [matMenuTriggerFor]="menu">
      <span class="text-center capitalize m-0">{{ principal.substring(0, 1) }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <h1 mat-menu-item>Hello <span>{{ principal }}!</span></h1>
      <button mat-menu-item type="button" [asyncButton]="logout()">logout</button>
    </mat-menu>
  `,
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
