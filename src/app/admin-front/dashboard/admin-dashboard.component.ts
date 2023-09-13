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

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private dashboardService: DashboardService = inject(DashboardService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);
  private productService: ProductService = inject(ProductService);

  // User principal
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
      map((
        [
          principal,
          products,
          categories,
          collections
        ]: [AuthResponse, Page<ProductResponse>, CategoryResponse[], CollectionResponse[]]
      ): { state: string, error?: string, principal?: string } => {
        this.productService.setProducts(products);
        this.categoryService.setCategories(categories);
        this.collectionService.setCollections(collections);
        return {state: 'LOADED', principal: principal.principal};
      }),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error}))
    );


  // Loading of components
  dashBoardLinks: Display[] = DASHBOARDLINKS;

  // Current route
  currentRoute: string = 'statistics'; // statistics as it is the initial route
  leftColumn: boolean = false;

  /**
   * Method dynamically loads components based on <li><a>route</a></li> clicked.
   * @param currentRoute is the current child component rendered
   * @return void
   * */
  activeLink(currentRoute: string): void {
    this.currentRoute = currentRoute;
    this.leftColumn = false;
  }

}
