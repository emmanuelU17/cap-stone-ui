import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "../navigation/store-front-navigation.component";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, StoreFrontNavigationComponent],
  template: `
    <div class="lg-scr z-10 border-b border-transparent fixed left-0 top-0 right-0">
      <app-store-front-navigation-navigation></app-store-front-navigation-navigation>
    </div>
    <div class="lg-scr mg-top p-2.5 bg-blue-400">
      <h1>Page not found :(</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent { }
