import {ChangeDetectionStrategy, Component, HostListener, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CollectionService} from "../../shop/collection/collection.service";
import {CartIconComponent} from "../carticon/cart-icon.component";
import {SearchComponent} from "../search/search.component";
import {MobileNavigationComponent} from "../mobile-navigation/mobile-navigation.component";
import {Link} from "../../../global-utils";

@Component({
  selector: 'app-store-front-navigation-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CartIconComponent, SearchComponent, MobileNavigationComponent],
  template: `
    <nav class="w-full p-2.5 grid grid-cols-3 bg-transparent" [ngStyle]="navBg">

      <!-- Left -->
      <div class="flex items-center mr-auto">

        <!--  Mobile  -->
        <div class="block lg:hidden">
          <!-- burger -->
          <button class="bg-transparent outline-none border-none cursor-pointer relative" type="button"
                  (click)="openNavMobile = !openNavMobile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                 class="w-6 h-6" style="color: var(--app-theme)">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>

          <div [style]="{ 'display': openNavMobile ? 'block' : 'none' }" class="fixed top-0 right-0 bottom-0 left-0">
            <app-mobile-navigation
              [links]="links"
              [empty$]="collectionNotEmpty$"
              [openNavMobile]="openNavMobile"
              (emitter)="toggleNav($event)"
            ></app-mobile-navigation>
          </div>

        </div>

        <!--  None Mobile  -->
        <div class="hidden lg:block">
          <ul class="h-full flex items-center list-none gap-8">
            <li class="h-full flex items-center" *ngFor="let link of links">
              <ng-container  *ngIf="link.bool; else regular">
                <a class="group h-full relative flex items-center cursor-pointer uppercase text-[var(--app-theme)]">
                  shop
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>

                  <div class="absolute top-6 w-40 bg-white border hidden rounded-md group-hover:block">
                    <a
                      class="p-3 flex rounded-md whitespace-nowrap capitalize hover:text-[var(--active)] hover:bg-[var(--app-theme)]"
                      routerLink="/shop/category"
                    >shop category</a>

                    <!-- Only display collection if Collection[] it is not empty -->
                    <ng-container *ngIf="collectionNotEmpty$ | async as col">
                      <a
                        class="p-3 flex rounded-md whitespace-nowrap capitalize hover:text-[var(--active)] hover:bg-[var(--app-theme)]"
                        routerLink="/shop/collection"
                        [style]="{ 'display': col ? 'block' : 'none' }"
                      >shop collection</a>
                    </ng-container>
                  </div>
                </a>
              </ng-container>

              <ng-template #regular>
                <a class="uppercase flex text-[var(--app-theme)]" [routerLink]="link.value" routerLinkActive="active" >{{ link.name }}</a>
              </ng-template>
            </li>
          </ul>
        </div>

      </div>

      <!-- Center (logo) -->
      <div class="my-0 mx-auto cursor-pointer">
        <a routerLink="">
          <img src="assets/image/sara-the-brand.png" alt="logo" class="h-[2.5rem] w-[4.375rem] object-contain">
        </a>
      </div>

      <!-- Right -->
      <div class="flex items-center ml-auto">
        <ul class="flex gap-2 lg:gap-8 justify-end list-none">

          <!--    Search    -->
          <li>
              <app-search></app-search>
          </li>

          <!--    Shopping cart    -->
          <li>
            <app-cart-icon></app-cart-icon>
          </li>

          <!--    Person icon    -->
          <li class="hidden md:block">
            <a class="uppercase flex" routerLink="/account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6 cursor-pointer" style="color: var(--app-theme)">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>

    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreFrontNavigationComponent {

  private readonly collectionService = inject(CollectionService);

  collectionNotEmpty$ = this.collectionService.isEmpty$();

  links: Link[] = [{ name: 'home', value: '', bool: false }, { name: 'shop', value: '', bool: true, }];
  openNavMobile = false;

  navBg: any;

  /**
   * Applies bg white on nav container when scrolled down
   * */
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

  toggleNav(bool: boolean): void {
    this.openNavMobile = bool;
  }

}
