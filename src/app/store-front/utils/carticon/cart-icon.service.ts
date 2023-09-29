import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartIconService {

  private count: number = 0;

  private subject$ = new BehaviorSubject<number>(0);
  count$ = this.subject$.asObservable();

  set addItem(num: number) {
    this.count += num;
    this.subject$.next(this.count);
  }

  removeItem(): void {
    this.count -= 1;
    this.subject$.next(this.count);
  }


}
