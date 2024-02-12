import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, combineLatest, map, Observable, of, startWith, switchMap, tap} from "rxjs";
import {CategoryService} from "./category/category.service";
import {CategoryResponse} from "../shared-util";
import {SarreCurrency} from "../../global-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductService} from "./product/product.service";
import {DASHBOARDLINKS} from "./route-util";
import {CommonModule} from "@angular/common";
import {NavigationComponent} from "./util/navigation/navigation.component";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from "./util/footer/footer.component";
import {AuthMenuComponent} from "./util/authmenu/auth-menu.component";
import {DirectiveModule} from "../../directive/directive.module";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {SettingService} from "./setting/setting.service";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    MatIconModule,
    FooterComponent,
    AuthMenuComponent,
    DirectiveModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  template: `
    <ng-container *ngIf="combine$ | async as combine" [ngSwitch]="combine.state">

      <ng-container *ngSwitchCase="'LOADING'">
        <div class="lg-scr h-full p-20 flex justify-center items-center">
          <h1 class="capitalize text-[var(--app-theme-hover)]">
            loading...
          </h1>
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="'ERROR'">
        <div class="lg-scr p-10 capitalize text-3xl text-red-500">
          Error {{ combine.error }}
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="'LOADED'">
        <div class="lg-scr h-full flex flex-col overflow-x-hidden lg:m-auto">
          <!-- Navigation -->
          <div>
            <app-navigation [principal]="(principal$ | async) || ''"></app-navigation>
          </div>

          <!--  Main body  -->
          <div class="flex flex-1">
            <!--  Left Column  -->
            <div [style]="{ 'display': leftColumn ? 'block' : 'none' }"
              class="l-col hidden py-3.5 border-r-2 border-solid border-[var(--active)]">
              <div *ngFor="let link of dashBoardLinks; let j = index" class="w-52 py-0 px-2.5 max-[768px]:w-[calc(200px + 1vw)]">
                <div class="uppercase">

                  @if (j === 0) {
                    <div class="w-fit flex gap-2.5 border-b border-[var(--app-theme)]">
                      <h3 class="cx-font-size capitalize">{{ link.title }}</h3>

                      <div class="flex gap-1">
                        <button class="border"
                                (click)="setCurrency(SarreCurrency.NGN)"
                                [style]="{ 'background-color': activeCurrency === SarreCurrency.NGN ? '#E8E8E8' : 'white' }"
                        >{{ SarreCurrency.NGN }}
                        </button>
                        <button class="border"
                                (click)="setCurrency(SarreCurrency.USD)"
                                [style]="{ 'background-color': activeCurrency === SarreCurrency.USD ? '#E8E8E8' : 'white' }"
                        >{{ SarreCurrency.USD }}
                        </button>
                      </div>
                    </div>
                  } @else {
                    <h3 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">{{ link.title }}</h3>
                  }

                </div>
                <!--    End of title    -->

                <div class="py-2.5 px-0">
                  <ul class="list-none" *ngFor="let a of link.array; let i = index">
                    <li class="my-1.5 rounded-md" (click)="leftColumn = !leftColumn" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">
                      <a [routerLink]="a.route" class="w-full h-full p-2.5 flex items-center gap-1.5 capitalize cursor-pointer rounded-md">
                        <mat-icon>{{ a.icon }}</mat-icon> {{ a.name }}
                      </a>
                    </li>
                  </ul>
                </div>
                <!--    End of action container    -->

              </div>
              <!--    End of content    -->

              <div class="hidden max-[768px]:block">
                <ul class="list-none">
                  <li class="link flex p-2.5 capitalize cursor-pointer">
                    <app-auth-menu [principal]="(principal$ | async) || ''"></app-auth-menu>
                  </li>
                </ul>
              </div>
              <!--  End of Auth Icon  -->
            </div>

            <!--  Right Column  -->
            <div class="p-2.5 flex flex-col flex-1 overflow-x-auto">
              <div class="flex-1">
                <router-outlet></router-outlet>
              </div>

              <!-- Button to display Left column -->
              <div class="sticky rounded-full w-fit bottom-2/4 bg-[var(--app-theme)] opacity-50 hover:opacity-100">
                <button class="p-3 bg-[var(--in-active)]" (click)="leftColumn = !leftColumn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!--  Footer  -->
          <div class="p-3.5 items-end border-t-2 border-solid border-[var(--active)]">
            <app-footer></app-footer>
          </div>
        </div>
      </ng-container>

    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {

  private readonly authService = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly setting = inject(SettingService);

  protected readonly SarreCurrency = SarreCurrency;
  readonly principal$ = this.authService.principal$
  readonly dashBoardLinks = DASHBOARDLINKS;

  activeCurrency = SarreCurrency.NGN;
  leftColumn = false;

  /**
   * To improve UX, on load of Admin route, based on default currency,
   * make call to server to return a {@code Page} of {@code ProductResponse}.
   *
   * @return An Observable of a {@code Page} of {@code ProductResponse}.
   * */
  private readonly products$ = this.productService.currency$
    .pipe(switchMap((currency) => this.productService.allProducts(0, 20, currency)));

  /**
   * To improve UX, on load of Admin route, make call to server to
   * return all {@code CategoryResponse} where we sort based on
   * property name.
   *
   * @return An Observable of an array of {@code CategoryResponse}.
   * */
  private readonly category$ = this.categoryService.allCategories()
    .pipe(
      tap((arr: CategoryResponse[]) => arr.sort((a, b) => a.name.localeCompare(b.name)))
    );

  /**
   * To improve UX, on load of Admin route, make call to server to
   * return all Tax information.
   *
   * @return An Observable of an array of {@code ShipSetting}.
   * */
  private readonly ship$ = this.setting.allShipping();

  /**
   * To improve UX, on load of Admin route, make call to server to
   * return all Tax information.
   *
   * @return An Observable of an array of {@code TaxSetting}.
   * */
  private readonly tax$ = this.setting.allTaxSetting();

  readonly combine$: Observable<{ state: string, error?: string }> =
    combineLatest([this.products$, this.category$, this.ship$, this.tax$])
      .pipe(
        map(() => ({ state: 'LOADED' })),
        startWith({ state: 'LOADING' }),
        catchError((e: HttpErrorResponse) =>
          of({ state: 'ERROR', error: e.error ? e.error.message : e.message })
        )
      );

  /**
   * Set currency for the whole admin front
   * */
  setCurrency = (currency: SarreCurrency): void => {
    this.activeCurrency = currency;
    this.productService.setCurrencySubject(currency);
  }

}
