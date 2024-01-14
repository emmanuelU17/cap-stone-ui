import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith, switchMap, tap} from "rxjs";
import {CategoryService} from "./category.service";
import {Product} from "../../store-front-utils";
import {CommonModule} from "@angular/common";
import {CardComponent} from "../../utils/card/card.component";
import {FilterComponent} from "../../utils/filter/filter.component";
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {Page, SarreCurrency} from "../../../global-utils";
import {PaginatorComponent} from "../../../shared-comp/paginator/paginator.component";
import {UtilService} from "../../../service/util.service";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CardComponent, FilterComponent, RouterLink, PaginatorComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  private readonly footService = inject(FooterService);
  private readonly categoryService = inject(CategoryService);
  private readonly utilService = inject(UtilService);

  totalElements = 0;
  filterByPrice = true; // A variable need to keep the state of price filter for future filtering
  displayFilter = false; // Displays filter button

  currency = (str: string): string => this.footService.currency(str);

  readonly categories$ = this.categoryService.categories$;

  /**
   * filters products array in ascending or descending order based on price
   * */
  ascendingOrDescending = (arr: Product[]): Product[] => this.utilService.sortArray(this.filterByPrice, arr);

  toggleFilter(bool: boolean): void {
    this.displayFilter = bool;
  }

  /**
   * load products from server on load of category component
   * */
  categoryImpl = (page: number) => this.footService
    .currency$
    .pipe(
      switchMap((currency) => this.categoryService.category$
        .pipe(map((categoryId) => ({ id: categoryId, currency: currency })))
      ),
      switchMap((obj: { id: number, currency: SarreCurrency }) => this.categoryService
        .productsBasedOnCategory(obj.id, obj.currency, page)
        .pipe(
          tap((p: Page<Product>): void => { this.totalElements = p.content.length; }),
          map((p: Page<Product>) => ({ state: 'LOADED', data: p }))
        )
      ),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) =>
        of({ state: 'ERROR', error: err.error ? err.error.message : err.message })
      )
    );

  products$: Observable<{ state: string, error?: string, data?: Page<Product> }> = this.categoryImpl(0);

  /**
   * Re-renders products pages based on page number clicked
   * */
  pageNumberClick(num: number): void {
    this.products$ = this.categoryImpl(num);
  }

  /**
   * Refresh products based on category clicked
   * */
  categoryClicked(obj: { categoryId: number; name: string }): void {
    this.categoryService.currentCategorySubject.next(obj.categoryId);
  }

}
