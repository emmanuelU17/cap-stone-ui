import {ChangeDetectionStrategy, Component, HostListener, inject} from '@angular/core';
import {HomeService} from "./home/home.service";
import {ProductService} from "./shop/service/product.service";
import {CategoryService} from "./shop/service/category.service";
import {CollectionService} from "./shop/service/collection.service";
import {catchError, combineLatest, map, Observable, of, startWith, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Product} from "./store-front-utils";

// Component where storefront details will be rendered
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {
  private homeService: HomeService = inject(HomeService);
  private productService: ProductService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);

  private bgImages$: Observable<string[]> = this.homeService.fetchHomeBackground();
  private products$: Observable<Product[]> = this.productService.fetchProducts(0, 40);
  private categories$: Observable<string[]> = this.categoryService.fetchCategories();
  private collections$: Observable<string[]> = this.collectionService.fetchCollections();

  // On load of storefront routes, get necessary data to improve user experience
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

  navBg: any;

  /** Applies bg white on nav container when scrolled down */
  @HostListener('document:scroll') scroll(): void {
    let bool: boolean = document.body.scrollTop > 0 || document.documentElement.scrollTop > 0;
    const css = {
      'background-color': 'var(--white)',
      'box-shadow': '4px 6px 12px rgba(0, 0, 0, 0.2)',
      'border-bottom-right-radius':'3px',
      'border-bottom-left-radius':'3px',
    };

    this.navBg = bool ? css : {};
  }

}
