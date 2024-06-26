import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Page, SarreCurrency } from '@/app/global-utils';
import { Product } from '@/app/store-front/store-front-utils';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly subject = new BehaviorSubject<boolean>(false);
  readonly openSearchComponent$ = this.subject.asObservable();

  /**
   * Opens search.component.ts
   * */
  openComponent(bool: boolean): void {
    this.subject.next(bool);
  }

  /**
   * Returns an array of ProductResponse based on param.
   *
   * @param size
   * @param s is the user param search choice.
   * @param currency is the currency set in footerService.
   * @return Observable of {@link Product} array.
   * */
  _search(
    size: number,
    s: string,
    currency: SarreCurrency,
  ): Observable<Page<Product>> {
    const url = `${this.HOST}api/v1/client/product/find?size=${size}&search=${s}&currency=${currency}`;
    return this.http.get<Page<Product>>(url, { withCredentials: true });
  }
}
