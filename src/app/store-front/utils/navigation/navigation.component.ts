import {ChangeDetectionStrategy, Component, Renderer2} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  links: Link[] = [
    { name: 'home', value: '', bool: false },
    {
      name: 'shop/category',
      value: '',
      bool: true,
      list: ['']
    },
  ];

  constructor(private _render: Renderer2) { }

  /** Displays burger icon in mobile view */
  _displayNavBar(): void {
    this._render.selectRootElement('.mob-vw', true).classList.toggle('mobile-toggle');
  }

  //
  _displayShopLinks(): void {
    this._render.selectRootElement('.shop', true).classList.toggle('mobile-toggle')
  }

}

interface Link {
  name: string;
  value: string;
  bool?: boolean;
  list?: string[];
}
