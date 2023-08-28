import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  HOST: string | undefined;

  private bgImages$ = new BehaviorSubject<string[]>([]);
  _bgImage$ = this.bgImages$.asObservable();

  /**
   * Adds an array of pre-assigned urls. Method is called in AppComponent
   * @param arr of pre-assigned urls
   * @return void
   * */
  setBgImages(arr: string[]): void {
    this.bgImages$.next(arr);
  }

  getImageArray(): string[] {
    return this.bgImages$.getValue();
  }

}
