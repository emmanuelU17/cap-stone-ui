import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartIconService {

  private _close$ = new BehaviorSubject<boolean>(false);
  onOpenCartComponent$ = this._close$.asObservable();

  private set = new Set<string>();
  private subject$ = new BehaviorSubject<number>(0);
  count$ = this.subject$.asObservable();

  set addItem(sku: string) {
    this.set.add(sku);
    this.subject$.next(this.set.size);
  }

  removeItem(sku: string): void {
    this.set.delete(sku);
    this.subject$.next(this.set.size);
  }

  /** Close Cart Component */
  set close(bool: boolean) {
    this._close$.next(bool);
  }

}
