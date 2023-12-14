import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {Cart, CartDTO} from "../../shop/shop.helper";
import {ToastService} from "../../../shared-comp/toast/toast.service";
import {SarreCurrency} from "../../../global-utils";
import {FooterService} from "../../utils/footer/footer.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly footerService = inject(FooterService);
  private readonly toastService = inject(ToastService);

  private readonly subject = new BehaviorSubject<Cart[]>([]);
  cart$ = this.subject.asObservable();

  // Displays currency symbol
  currency = (str: string): string => str.toUpperCase() === SarreCurrency.NGN
    ? SarreCurrency.NGN_SYMBOL
    : SarreCurrency.USD_SYMBOL;

  /**
   * Returns the number of items in Cart[]
   * */
  count$ = (): Observable<number> => this.cart$.pipe(map((arr: Cart[]) => arr.length));

  /**
   * Returns an Observable of list of Cart
   * */
  cartItems(currency: SarreCurrency): Observable<Cart[]> {
    const url = `${this.HOST}api/v1/cart?currency=${currency}`
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
    const url = `${this.HOST}api/v1/cart`
    return this.http.post<CartDTO>(url, cart, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(
      switchMap((res: HttpResponse<CartDTO>) => this.footerService.currency$
        .pipe(
          switchMap((currency) => this.cartItems(currency)
            .pipe(map(() => (res.status)))
          )
        )
      ),
      catchError((err: HttpErrorResponse) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err.status);
      })
    );
  }

  /**
   * Removes from Cart[] based on Product sku
   *
   * @param sku is a unique string for each Product
   * */
  removeFromCart(sku: string): Observable<number> {
    const url = `${this.HOST}api/v1/cart?sku=${sku}`
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
