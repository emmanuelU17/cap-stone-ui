import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {Cart, CartExpiry, SHOP_CONSTANT} from "../../shop/shop.helper";

@Injectable({
  providedIn: 'root'
})
export class CartIconService {

  private openCartSubject = new BehaviorSubject<boolean>(false);
  onOpenCartComponent$ = this.openCartSubject.asObservable();

  private cartExpiry = (): CartExpiry | undefined => {
    const item = localStorage.getItem(SHOP_CONSTANT.CART);
    return item ? JSON.parse(item) as CartExpiry : undefined;
  };

  items = (): Cart[] => {
    const e = this.cartExpiry();
    return !e ? [] : e.cart;
  };

  private cartSubject = new ReplaySubject<Cart[]>();
  carts$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  count$ = this.cartCountSubject.asObservable();

  constructor() {
    const exp = this.cartExpiry();

    if (!exp || !exp.cart) {
      return;
    }

    this.cartSubject.next(exp.cart);
    this.cartCountSubject.next(exp.cart.length);
  }

  clearCart(): void {
    const exp = this.cartExpiry();

    if (!exp) {
      return;
    }

    if (new Date().getDate() > exp.expire) {
      localStorage.removeItem(SHOP_CONSTANT.CART);
    }

  }

  removeItem(sku: string): void {
    const expiry: CartExpiry | undefined = this.cartExpiry();

    if (!expiry) {
      return;
    }
    const cart = expiry.cart;
    const index = cart.findIndex(c => c.sku === sku);

    if (index < 0) {
      return;
    }

    cart[index] = cart[cart.length - 1];
    cart.pop();

    this.cartCountSubject.next(cart.length);
    this.cartSubject.next(cart);
    localStorage.setItem(SHOP_CONSTANT.CART, JSON.stringify(expiry))
  }

  /** Close cart component */
  set close(bool: boolean) {
    this.openCartSubject.next(bool);
  }

  set addToCart(item: Cart) {
    const cartE: CartExpiry | undefined = this.cartExpiry();
    const date: number = Date.now();

    // Cart is empty
    if (!cartE) {
      const cart: Cart[] = [];
      cart.push(item);

      const expiry: CartExpiry = {
        created: date,
        expire: new Date(date).setHours(24),
        cart: cart
      }
      localStorage.setItem(SHOP_CONSTANT.CART, JSON.stringify(expiry));
      return;
    }

    // update expiry time by 12 hrs
    cartE.expire = new Date(date).setHours(12);

    // Cart is not empty
    const cart: Cart[] = cartE.cart;
    const find = cart.find(c => c.sku === item.sku);

    // If item is found, increment replace the quantity
    if (find) {
      find.qty = item.qty;
    } else {
      cart.push(item);
    }

    this.cartCountSubject.next(cart.length);
    this.cartSubject.next(cart);
    localStorage.setItem(SHOP_CONSTANT.CART, JSON.stringify(cartE))
  }

}
