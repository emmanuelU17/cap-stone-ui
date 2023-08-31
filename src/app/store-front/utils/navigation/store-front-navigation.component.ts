import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-store-front-navigation-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './store-front-navigation.component.html',
  styleUrls: ['./store-front-navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreFrontNavigationComponent {
  private _render: Renderer2 = inject(Renderer2);

  links: Link[] = [{ name: 'home', value: '', bool: false }, { name: 'shop',  value: '',  bool: true, }];
  openNavMobile: boolean = false;
  openCategoryToggle: boolean = false;

  _displayShopLinks(): void {
    this._render.selectRootElement('.shop', true).classList.toggle('mobile-toggle')
  }

}

interface Link {
  name: string;
  value: string;
  bool?: boolean;
}
