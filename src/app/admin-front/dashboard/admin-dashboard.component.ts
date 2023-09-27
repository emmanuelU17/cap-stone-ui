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
  templateUrl: './admin-dashboard.component.html',
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
