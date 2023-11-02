import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {Cart, CartDTO} from "../shop.helper";
import {ToastService} from "../../../service/toast/toast.service";
import {SarreCurrency} from "../../../global-utils";
import {FooterService} from "../../utils/footer/footer.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  HOST: string | undefined = environment.domain;

  private readonly http = inject(HttpClient);
  private readonly footerService = inject(FooterService);
  private readonly toastService = inject(ToastService);

  private subject = new BehaviorSubject<Cart[]>([]);
  cart$ = this.subject.asObservable();

  private openCartSubject = new BehaviorSubject<boolean>(false);
  onOpenCartComponent$ = this.openCartSubject.asObservable();

  // Displays currency symbol
  currency = (str: string): string => {
    return str.toUpperCase() === SarreCurrency.NGN
      ? SarreCurrency.NGN_SYMBOL
      : SarreCurrency.USD_SYMBOL;
  }

  /**
   * Close cart component
   * */
  set close(bool: boolean) {
    this.openCartSubject.next(bool);
  }

  /**
   * Returns the number of items in Cart[]
   * */
  count$ = (): Observable<number> => this.cart$.pipe(map((arr) => arr.length));

  /**
   * Returns an Observable of list of Cart
   * */
  cartItems(currency: SarreCurrency): Observable<Cart[]> {
    const url = `${this.HOST}api/v1/client/cart?currency=${currency}`
    return this.http.get<Cart[]>(url, {
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
      withCredentials: true
    }).pipe(tap((arr: Cart[]) => ( this.subject.next(arr) )));
  }

  /**
   * Creates a new shopping session or persists cart
   * details to an existing shopping session
   *
   * @param cart of type CartDTO
   * @return Observable of type number
   * */
  createCart(cart: CartDTO): Observable<number> {
    const url = `${this.HOST}api/v1/client/cart`
    return this.http.post<CartDTO>(url, cart, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(
      switchMap((res: HttpResponse<CartDTO>) => this.footerService.currency$
        .pipe(
          switchMap((currency) => this.cartItems(currency)
            .pipe(map(() => (res.status))))
        )
      ),
      catchError((err) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err);
      })
    );
  }

  /**
   * Removes from Cart[] based on Product sku
   *
   * @param sku is a unique string for each Product
   * */
  removeFromCart(sku: string): Observable<number> {
    const url = `${this.HOST}api/v1/client/cart?sku=${sku}`
    return this.http.delete<any>(url, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      switchMap((res) => this.footerService.currency$
        .pipe(
          switchMap((currency) => this.cartItems(currency)
            .pipe(map(() => (res.status)))
          )
        )
      )
    );
  }

}
