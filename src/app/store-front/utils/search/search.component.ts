import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchService} from "./search.service";
import {Observable, of} from "rxjs";
import {DirectiveModule} from "../../../directive/directive.module";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button (click)="openSearchBar()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6 cursor-pointer" style="color: var(--app-theme)">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
      </button>

      <div *ngIf="openSearchComponent$ | async as open"
           [style]="{ 'display': open ? 'flex' : 'none' }"
           class="flex flex-col z-15 fixed top-0 right-0 bottom-0 left-0"
      >
        <!-- Search -->
        <div class="w-full h-fit p-4 flex justify-center bg-white">
          <!-- close component button -->
          <div class="mr-3 flex items-center">
            <button (click)="closeSearchBar()" class="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- search input -->
          <label for="search-bar" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>

            <input type="search"
                   id="search-bar"
                   class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                   placeholder="I'm searching for..."
                   (keyup)="onSearch($event)">
          </div>
        </div>

        <!-- Display component -->
        <div class="w-full h-full">

          <!-- Mobile view -->
          <div class="block p-4 bg-red-500 lg:hidden">
            hello mobile view
          </div>

          <!-- Non-mobile view -->
          <div class="h-full p-4 bg-purple-400">
            hello none mobile view
          </div>

        </div>

      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  private readonly searchService = inject(SearchService);
  openSearchComponent$ = this.searchService.openSearchComponent$;

  closeSearchBar(): void {
    this.searchService.openComponent(false);
  }

  openSearchBar(): void {
    this.searchService.openComponent(true);
  }

  onSearch(event: KeyboardEvent): void {
    const s = (event.target as HTMLInputElement).value;
    console.log('Search values ', s);
  }

}
