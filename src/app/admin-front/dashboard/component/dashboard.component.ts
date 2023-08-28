import {ChangeDetectionStrategy, Component, Renderer2} from '@angular/core';
import {catchError, combineLatest, map, Observable, of, startWith, tap} from "rxjs";
import {DashboardService} from "../dashboard.service";
import {CategoryService} from "../category/category.service";
import {CategoryResponse, CollectionResponse, Components, ProductResponse} from "../../shared-util";
import {Page} from "../../../../global-utils/global-utils";
import {AuthResponse} from "../../auth/util";
import {HttpErrorResponse} from "@angular/common/http";
import {CollectionService} from "../collection/collection.service";
import {ProductService} from "../product/product.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  leftColumn: boolean = false;

  // Loading of components
  protected readonly Components = Components;
  dashBoardLinks: Display[] = dashBoardLinks;
  componentToRender: Components = Components.dashboard;

  combine$: Observable<{
    state: string,
    error?: string,
    principal?: string,
  }>

  constructor(
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private productService: ProductService,
    private dashboardService: DashboardService,
    private render: Renderer2
  ) {
    // User principal
    const principal$ = this.dashboardService._principal$.pipe();

    // Fetch Products
    const products$ = this.productService.fetchAllProducts();

    // Fetch and Sort by Category
    const _category$ = this.categoryService.fetchCategories().pipe(
      tap((arr: CategoryResponse[]) =>
        arr.sort((a: CategoryResponse, b: CategoryResponse) => a.category.localeCompare(b.category)))
    );

    // Fetch Collection
    const _collection$ = this.collectionService.fetchCollections().pipe(
      tap((arr: CollectionResponse[]) =>
        arr.sort((a: CollectionResponse, b: CollectionResponse) => a.collection.localeCompare(b.collection)))
    );

    this.combine$ = combineLatest([principal$, products$, _category$, _collection$]).pipe(
      map(([
             principal,
             products,
             categories,
             collections
           ]: [AuthResponse, Page<ProductResponse>, CategoryResponse[], CollectionResponse[]]
      ) => {
        this.productService.setProducts(products);
        this.categoryService.setCategories(categories);
        this.collectionService.setCollections(collections);
        return {state: 'LOADED', principal: principal.principal};
      }),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error}))
    );
  }


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
