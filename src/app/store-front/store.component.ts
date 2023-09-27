import {ChangeDetectionStrategy, Component, HostListener, inject} from '@angular/core';
import {HomeService} from "./home/home.service";
import {CategoryService} from "./shop/service/category.service";
import {CollectionService} from "./shop/service/collection.service";
import {catchError, combineLatest, map, Observable, of, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Category, Collection} from "./shop/shop.helper";
import {CommonModule} from "@angular/common";
import {StoreFrontNavigationComponent} from "./utils/navigation/store-front-navigation.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, StoreFrontNavigationComponent, RouterOutlet],
  templateUrl: './store.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {

  private readonly homeService: HomeService = inject(HomeService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly collectionService: CollectionService = inject(CollectionService);

  // Navigation background on scroll
  navBg: any;

  private bgImages$: Observable<string[]> = this.homeService.fetchHomeBackground();
  private categories$: Observable<Category[]> = this.categoryService.fetchCategories();
  private collections$: Observable<Collection[]> = this.collectionService.fetchCollections();

  // On load of storefront routes, get necessary data to improve user experience
  combine$: Observable<{
    state: string,
    error?: string,
    bgImages?: string[],
    categories?: Category[],
    collections?: Collection[]
  }> = combineLatest([this.bgImages$, this.categories$, this.collections$])
    .pipe(
      map((): { state: string } => ({ state: 'LOADED' })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
    );

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
