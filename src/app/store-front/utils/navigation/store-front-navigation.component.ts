import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
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

  navBg: any;

  /** Applies bg white on nav container when scrolled down */
  @HostListener('document:scroll') scroll(): void {
    let bool: boolean = document.body.scrollTop > 0 || document.documentElement.scrollTop > 0;
    const css = {
      'background-color': 'var(--white)',
      'box-shadow': '4px 6px 12px rgba(0, 0, 0, 0.2)',
      'border-bottom-right-radius':'3px',
      'border-bottom-left-radius':'3px',
    };

    this.navBg = bool ? css : {};
  }

}

interface Link {
  name: string;
  value: string;
  bool?: boolean;
}
