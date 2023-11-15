import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchService} from "./search.service";
import {debounceTime, distinctUntilChanged, fromEvent, map, Observable, of, startWith, switchMap} from "rxjs";
import {FooterService} from "../footer/footer.service";
import {CardComponent} from "../card/card.component";
import {Product} from "../../store-front-utils";
import {Router} from "@angular/router";
import {SarreCurrency} from "../../../global-utils";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, CardComponent],
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
                   class="search-box block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                   placeholder="I'm searching for...">
          </div>
        </div>

        <!-- Display component -->
        <div class="w-full h-full flex flex-col overflow-y-auto">

          <!-- search results -->
          <div class="p-4 bg-white">
            <ng-container *ngIf="products$() | async as products">
                <div class="w-full bg-white p-2 xl:p-0 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <button *ngFor="let product of p" (click)="onItemClicked(product)">
                    <app-card
                      [url]="product.image"
                      [name]="product.name"
                      [currency]="currency(product.currency)"
                      [price]="product.price"
                    ></app-card>
                  </button>
                </div>
            </ng-container>
          </div>

          <div class="w-full flex-1 bg-black opacity-50"></div>

        </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  private readonly searchService = inject(SearchService);
  private readonly footerService = inject(FooterService);
  private readonly router = inject(Router);
  private readonly render = inject(Renderer2);

  openSearchComponent$ = this.searchService.openSearchComponent$;
  currency = (currency: string) => this.footerService.currency(currency);
  p: Product[] = [];

  closeSearchBar(): void {
    this.searchService.openComponent(false);
  }

  openSearchBar(): void {
    this.searchService.openComponent(true);
  }

  onItemClicked(p: Product): void {
    this.router.navigate([`/shop/category/product/${p.product_id}`]);
    this.closeSearchBar();
  }

  /**
   * Makes call to server to search for item based on user input and currency
   * */
  products$ = (): Observable<Product[]> => {
    const element = this.render.selectRootElement('.search-box', true);
    return fromEvent<KeyboardEvent>(element, 'keyup')
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        switchMap((value: string) => this.footerService.currency$
          .pipe(map((c: SarreCurrency) => ({ value: value, currency: c })))
        ),
        switchMap((obj: { value: string, currency: SarreCurrency })=> obj.value.trim() === ''
          ? of()
          : this.searchService._search(obj.value, obj.currency)
        ),
        map((products) => this.p = products),
        startWith([])
      );
  }

}
