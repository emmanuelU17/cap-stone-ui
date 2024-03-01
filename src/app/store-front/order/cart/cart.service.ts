import {inject, Injectable} from '@angular/core';
import {environment} from "@/environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {Cart, CartDTO} from "@/app/store-front/shop/shop.helper";
import {ToastService} from "@/app/shared-comp/toast/toast.service";
import {SarreCurrency} from "@/app/global-utils";
import {FooterService} from "@/app/store-front/utils/footer/footer.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly footerService = inject(FooterService);
  private readonly toastService = inject(ToastService);

  private readonly subject = new BehaviorSubject<Cart[]>([]);
  readonly cart$ = this.subject.asObservable();

  /**
   * Sums the total of product in {@link Cart}
   * */
  readonly total$ = this.cart$
    .pipe(map((arr: Cart[]) => arr.reduce((sum, cart) => sum + (cart.qty * cart.price), 0)));

  /**
   * Returns the number of items in {@link Cart} array.
   * */
  readonly count$ = this.cart$.pipe(map((arr: Cart[]) => arr.length));

  /**
   * Returns an Observable of list of {@link Cart}.
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
   * @param cart of type {@link CartDTO}
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
      )
    );
  }

  /**
   * Removes from {@link Cart} array based on {@link Product} property sku.
   *
   * @param sku is a unique string for each Product
   * */
  removeFromCart(sku: string): Observable<number> {
    const url = `${this.HOST}api/v1/cart?sku=${sku}`
    return this.http.delete<any>(url, { observe: 'response', withCredentials: true })
      .pipe(
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
