import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {DirectiveModule} from "../../../directive/directive.module";
import {Observable} from "rxjs";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DirectiveModule],
  template: `
    <div class="lg-scr h-full">
      <div style="padding: calc(1vh + 20px)"></div>
      <div class="h-full flex">
        <!-- left column -->
        <div class="py-3">
          <ul class="list-none">
            <li (click)="leftColumn = !leftColumn"
                *ngFor="let link of links"
                class="my-1.5 border-b border-[var(--app-theme)]"
                routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }"
            >
              <a [routerLink]="link" class="w-full h-full flex p-2.5 gap-1.5 capitalize cursor-pointer">
                {{ link }}
              </a>
            </li>

          </ul>
          <div class="w-full border-b border-[var(--app-theme)]">
            <button type="button"
                    [asyncButton]="logout()"
                    class="p-2.5"
            >logout</button>
          </div>
        </div>

        <!-- right column -->
        <div class="py-3 flex-1">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  private readonly authService = inject(AuthService);

  links = ['overview', 'orders'];

  leftColumn = false;

  logout = (): Observable<number> => this.authService.logout('/profile/authentication');

}
