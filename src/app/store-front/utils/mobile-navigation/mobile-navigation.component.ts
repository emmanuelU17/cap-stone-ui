import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {Link} from "../../../global-utils";
import {Observable} from "rxjs";

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="h-full w-full flex flex-col gap-3 bg-white">

      <div class="flex justify-between w-full p-2">
        <button type="button" (click)="toggleNavDisplay(openNavMobile = !openNavMobile)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Center (logo) -->
        <div class="my-0 mx-auto cursor-pointer">
          <a routerLink="" (click)="toggleNavDisplay(openNavMobile = !openNavMobile)">
            <img src="assets/image/sara-the-brand.png" alt="logo" class="h-[2.5rem] w-[4.375rem] object-contain">
          </a>
        </div>

        <!--    Person icon    -->
        <button (click)="toggleNavDisplay(openNavMobile = !openNavMobile)">
          <a class="h-full w-full flex items-center uppercase" routerLink="/account">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6 cursor-pointer" style="color: var(--app-theme)">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
          </a>
        </button>

      </div>

      <!-- Other links -->
      <ul class="flex-col list-none flex gap-3">
        <li class="p-2.5 border-b" *ngFor="let link of links">

          <a class="block" *ngIf="link.bool; else regular">
            <span (click)="dropDown = !dropDown" class="uppercase flex justify-between text-[var(--app-theme)]">
              shop
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
            </span>

            <span [style]="{ 'display': dropDown ? 'block' : 'none' }"
                  (click)="toggleNavDisplay(openNavMobile = !openNavMobile)"
            >
              <a routerLink="/shop/category" class="p-2 pl-0 block text-sm text-[var(--app-theme)]">
                shop by category
              </a>

              <!-- Only display collection if Collection[] it is not empty -->
              <ng-container *ngIf="empty$ | async as col">
                <a
                  routerLink="/shop/collection"
                  class="p-2 pl-0 block text-sm text-[var(--app-theme)]"
                  [style]="{ 'display': col ? 'block' : 'none' }"
                >
                  shop by collection
                </a>
              </ng-container>

            </span>

          </a>

          <ng-template #regular>
            <a [routerLink]="link.value"
               (click)="toggleNavDisplay(openNavMobile = !openNavMobile)"
               class="w-full flex uppercase text-[var(--app-theme)]"
            >{{ link.name }}</a>
          </ng-template>
        </li>
      </ul>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavigationComponent {

  @Input() links!: Link[];
  @Input() empty$!: Observable<boolean>;
  @Input() openNavMobile!: boolean;

  @Output() emitter = new EventEmitter<boolean>();

  dropDown = false;

  toggleNavDisplay(bool: boolean): void {
    this.emitter.emit(bool);
  }


}
