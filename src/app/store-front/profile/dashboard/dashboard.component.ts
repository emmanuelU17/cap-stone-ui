import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="lg-scr h-full">
      <div style="padding: calc(1vh + 20px)"></div>
      <div class="h-full flex">
        <!-- left column -->
        <div class="py-3">
          <ul class="list-none">
            <li (click)="leftColumn = !leftColumn"
                *ngFor="let link of links"
                class="my-1.5"
                routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }"
            >
              <a [routerLink]="link" class="w-full h-full flex p-2.5 gap-1.5 capitalize cursor-pointer">
                {{ link }}
              </a>
            </li>

            <li class="my-1.5 cursor-pointer">logout</li>
          </ul>
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

  links = ['overview', 'orders'];

  leftColumn = false;

}
