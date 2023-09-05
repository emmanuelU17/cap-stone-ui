import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-store-front-navigation-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './store-front-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreFrontNavigationComponent {
  links: Link[] = [{ name: 'home', value: '', bool: false }, { name: 'shop',  value: '',  bool: true, }];
  openNavMobile: boolean = false;
}

interface Link {
  name: string;
  value: string;
  bool?: boolean;
}
