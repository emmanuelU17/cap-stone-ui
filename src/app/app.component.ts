import {ChangeDetectionStrategy, Component, HostListener, inject} from '@angular/core';
import {Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {catchError, combineLatest, filter, map, Observable, of, startWith, tap} from "rxjs";
import {AppService} from "./service/app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CSRF} from "./global-utils";
import {CategoryService} from "./store-front/shop/service/category.service";
import {ProductService} from "./store-front/shop/service/product.service";
import {HomeService} from "./store-front/home/home.service";
import {CollectionService} from "./store-front/shop/service/collection.service";
import {Product} from "./store-front/store-front-utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  navBg: any;

  private appService: AppService = inject(AppService);
  private homeService: HomeService = inject(HomeService);
  private productService: ProductService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);
  private router: Router = inject(Router);

  // Active route
  activeRoute$: Observable<{ bool: boolean }> = this.router.events.pipe(
    filter((event: Event): boolean => event instanceof NavigationEnd || event instanceof NavigationStart),
    map((event: Event): { bool: boolean } => {
      const url = event as NavigationEnd;
      return { bool: url.url.startsWith('/admin') };
    })
  );

  // Onload of application, get CSRF token
  csrf$: Observable<{ state: string, error?: string, csrf?: CSRF }> = this.appService.csrf().pipe(
    map(() => ({state: 'LOADED'})),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
  );

  private bgImages$: Observable<string[]> = this.homeService.fetchHomeBackground();
  private products$: Observable<Product[]> = this.productService.fetchProducts(0, 40);
  private categories$: Observable<string[]> = this.categoryService.fetchCategories();
  private collections$: Observable<string[]> = this.collectionService.fetchCollections();

  // On load of storefront routes, get necessary data to improve experience
  combine$: Observable<{
    state: string,
    error?: string,
    bgImages?: string[],
    products?: Product[],
    categories?: string[],
    collections?: string[]
  }> = combineLatest([this.bgImages$, this.products$, this.categories$, this.collections$])
    .pipe(
      map(([bgImages, products, categories, collections]: [string[], Product[], string[], string[]]) => {
        return {
          state: 'LOADED',
          bgImages: bgImages,
          products: products,
          categories: categories,
          collections: collections
        };
      }),
      tap((state: {
        state: string,
        bgImages: string[],
        products: Product[],
        categories: string[],
        collections: string[]
      }): void => {
        this.homeService.setBgImages(state.bgImages)
        this.productService.setProducts(state.products);
        this.categoryService.setCategories(state.categories);
        this.collectionService.setCollection(state.collections);
      }),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
    );

  /**
   * Validates if current route is an admin route.
   * @param url is route gotten from router.url (look in app.component.html)
   * @return boolean
   * */
  isAdmin(url: string): boolean {
    return url.startsWith('/admin');
  }

  /** Applies bg white on nav container when scrolled down */
  @HostListener('document:scroll') scroll(): void {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navBg = {
        'background-color': 'var(--white)',
        'box-shadow': '4px 6px 12px rgba(0, 0, 0, 0.2)',
        'border-bottom-right-radius':'3px',
        'border-bottom-left-radius':'3px',
      }
    } else {
      this.navBg = { }
    }
  }

}
