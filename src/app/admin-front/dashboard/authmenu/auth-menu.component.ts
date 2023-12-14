import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {DirectiveModule} from "../../../directive/directive.module";
import {AuthService} from "../../../service/auth.service";

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
      <button mat-menu-item type="button" [asyncButton]="logout$">logout</button>
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthMenuComponent {

  @Input() principal = '';

  private readonly authMenuService = inject(AuthService);

  logout$ = this.authMenuService.logout('/admin');

}
