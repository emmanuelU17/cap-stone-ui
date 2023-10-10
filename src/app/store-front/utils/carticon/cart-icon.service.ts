import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cart, SHOP_CONSTANT} from "../../shop/shop.helper";

@Injectable({
  providedIn: 'root'
})
export class CartIconService {

  private openCartSubject = new BehaviorSubject<boolean>(false);
  onOpenCartComponent$ = this.openCartSubject.asObservable();

  items = (): Cart[] => {
    const item = localStorage.getItem(SHOP_CONSTANT.CART);
    return item ? JSON.parse(item) as Cart[] : [];
  };

  private cartSubject = new BehaviorSubject<Cart[]>(this.items());
  carts$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(this.items().length);
  count$ = this.cartCountSubject.asObservable();

  removeItem(sku: string): void {
    const carts: Cart[] = this.items();
    const index = carts.findIndex(c => c.sku === sku);

    if (index < 0) {
      return;
    }

    carts[index] = carts[carts.length - 1];
    carts.pop();

    this.cartCountSubject.next(carts.length);
    this.cartSubject.next(carts);
    localStorage.setItem(SHOP_CONSTANT.CART, JSON.stringify(carts))
  }

  /** Close cart component */
  set close(bool: boolean) {
    this.openCartSubject.next(bool);
  }

  set addToCart(item: Cart) {
    const carts: Cart[] = this.items();
    const cart = carts.find(c => c.sku === item.sku);

    if (cart) {
      cart.qty = item.qty;
    } else {
      carts.push(item);
    }

    this.cartCountSubject.next(carts.length);
    this.cartSubject.next(carts);
    localStorage.setItem(SHOP_CONSTANT.CART, JSON.stringify(carts))
  }

}
