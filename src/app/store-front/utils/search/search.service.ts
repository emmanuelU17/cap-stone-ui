import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SarreCurrency} from "../../../global-utils";
import {Product} from "../../store-front-utils";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  HOST: string | undefined = environment.domain;

  private readonly http = inject(HttpClient);

  private readonly subject = new BehaviorSubject<boolean>(false);
  openSearchComponent$ = this.subject.asObservable();

  /**
   * Opens search.component.ts
   * */
  openComponent(bool: boolean): void {
    this.subject.next(bool);
  }

  /**
   * Returns an array of ProductResponse based on param
   *
   * @param s is the user param search choice
   * @param currency is the currency set in footerService
   * @return Observable of Product array
   * */
  _search(s: string, currency: SarreCurrency): Observable<Product[]> {
    const url = `${this.HOST}api/v1/client/product/find?search=${s}&currency=${currency}`;
    return this.http.get<Product[]>(url, { withCredentials: true });
  }

}
