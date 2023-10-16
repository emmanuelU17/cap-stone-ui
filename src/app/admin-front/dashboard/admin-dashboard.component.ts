import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, combineLatest, map, Observable, of, startWith, tap} from "rxjs";
import {DashboardService} from "./dashboard.service";
import {CategoryService} from "./category/category.service";
import {CategoryResponse, CollectionResponse, ProductResponse} from "../shared-util";
import {AuthResponse, Page} from "../../global-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {CollectionService} from "./collection/collection.service";
import {ProductService} from "./product/product.service";
import {DASHBOARDLINKS, Display} from "./route-util";
import {CommonModule} from "@angular/common";
import {NavigationComponent} from "./navigation/navigation.component";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from "./footer/footer.component";
import {AuthMenuComponent} from "./authmenu/auth-menu.component";
import {DirectiveModule} from "../../directive/directive.module";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

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
            <app-navigation></app-navigation>
          </div>

          <!--  Main body  -->
          <div class="flex flex-1">
            <!--  Left Column  -->
            <div
              [style]="{ 'display': leftColumn ? 'block' : 'none' }"
              class="l-col hidden py-3.5 border-r-2 border-solid border-[var(--active)]"
            >
              <div class="w-52 py-0 px-2.5 max-[768px]:w-[calc(200px + 1vw)]" *ngFor="let link of dashBoardLinks">
                <div class="uppercase">
                  <h3 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">{{ link.title }}</h3>
                </div>
                <!--    End of title    -->
                <div class="py-2.5 px-0">
                  <ul class="list-none" *ngFor="let a of link.array; let i = index">
                    <li
                      (click)="leftColumn = !leftColumn"
                      class="my-1.5 rounded-md"
                      routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }"
                    >
                      <a
                        [routerLink]="a.route"
                        class="w-full h-full flex p-2.5 gap-1.5 capitalize cursor-pointer rounded-md"
                      >
                        <span><mat-icon>{{ a.icon }}</mat-icon></span>
                        <span class="flex h-full items-center">{{ a.name }}</span>
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
                    <app-auth-menu [principal]="combine.principal || ''"></app-auth-menu>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
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

  private readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly productService: ProductService = inject(ProductService);

  // Left column links
  dashBoardLinks: Display[] = DASHBOARDLINKS;

  // Toggle behaviour when a link are clicked
  leftColumn: boolean = false;

  // Principal (email)
  private principal$: Observable<AuthResponse> = this.dashboardService._principal$.pipe();

  // Products
  private products$: Observable<Page<ProductResponse>> = this.productService.fetchAllProducts();

  // Categories
  private category$: Observable<CategoryResponse[]> = this.categoryService.fetchCategories()
    .pipe(
      tap((arr: CategoryResponse[]) => arr
        .sort((a: CategoryResponse, b: CategoryResponse) => a.category.localeCompare(b.category))
      )
    );

  // Collections
  private collection$: Observable<CollectionResponse[]> = this.collectionService.fetchCollections()
    .pipe(
      tap((arr: CollectionResponse[]) => arr
        .sort((a: CollectionResponse, b: CollectionResponse) => a.collection.localeCompare(b.collection))
      )
    );

  combine$: Observable<{
    state: string,
    error?: string,
    principal?: string,
  }> = combineLatest([this.principal$, this.products$, this.category$, this.collection$])
    .pipe(
      map(([principal]: [
        AuthResponse,
        Page<ProductResponse>,
        CategoryResponse[],
        CollectionResponse[]
        ]): { state: string, principal: string } => ({ state: 'LOADED', principal: principal.principal })
      ),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error }))
    );

}
