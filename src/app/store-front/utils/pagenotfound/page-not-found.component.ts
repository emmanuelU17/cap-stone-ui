import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "../navigation/store-front-navigation.component";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, StoreFrontNavigationComponent],
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent { }
