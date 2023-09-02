import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, combineLatest, map, Observable, of, startWith, tap} from "rxjs";
import {DashboardService} from "../dashboard.service";
import {CategoryService} from "../category/category.service";
import {CategoryResponse, CollectionResponse, Components, ProductResponse} from "../../shared-util";
import {AuthResponse, Page} from "../../../../global-utils/global-utils";
import {HttpErrorResponse} from "@angular/common/http";
import {CollectionService} from "../collection/collection.service";
import {ProductService} from "../product/product.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private dashboardService: DashboardService = inject(DashboardService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);
  private productService: ProductService = inject(ProductService);

  private principal$: Observable<AuthResponse> = this.dashboardService._principal$.pipe();
  private products$: Observable<Page<ProductResponse>> = this.productService.fetchAllProducts();
  private category$: Observable<CategoryResponse[]> = this.categoryService.fetchCategories()
    .pipe(
      tap((arr: CategoryResponse[]) => arr
        .sort((a: CategoryResponse, b: CategoryResponse) => a.category.localeCompare(b.category))
      )
    );
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

  leftColumn: boolean = false;
  // Loading of components
  protected readonly Components = Components;
  dashBoardLinks: Display[] = dashBoardLinks;
  componentToRender: Components = Components.dashboard;

  /**
   * Method dynamically loads components based on <li> clicked.
   * @return void
   * */
  loadComponent(item: Components): void {
    this.componentToRender = item
    this.leftColumn = false;
  }

}

interface Display {
  title: string;
  array: List[];
}

interface List {
  icon: string,
  name: Components
  index: number
}

const dashBoardLinks: Display[] = [
  {
    title: 'quick links',
    array: [
      {
        icon: 'dashboard',
        name: Components.dashboard,
        index: 0
      },
      {
        icon: 'shopping_basket-hunt',
        name: Components.new_product,
        index: 1
      },
      {
        icon: 'new_releases',
        name: Components.new_category,
        index: 2
      },
      {
        icon: 'card_giftcard',
        name: Components.new_collection,
        index: 3
      },
    ]
  },
  {
    title: 'catalog',
    array: [
      {
        icon: 'shopping_basket-hunt',
        name: Components.product,
        index: 4
      },
      {
        icon: 'flare',
        name: Components.category,
        index: 5
      },
      {
        icon: 'filter_center_focus',
        name: Components.collection,
        index: 6
      },
    ]
  },
  {
    title: 'customer',
    array: [
      {
        icon: 'supervised_user_circle',
        name: Components.customer,
        index: 7
      }
    ]
  },
  {
    title: 'register',
    array: [
      {
        icon: 'home',
        name: Components.register,
        index: 8
      }
    ]
  }
];
