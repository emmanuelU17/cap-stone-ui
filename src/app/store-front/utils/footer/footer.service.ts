import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SarreCurrency} from "../../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private subject = new BehaviorSubject<SarreCurrency>(SarreCurrency.NGN);
  currency$ = this.subject.asObservable();

  activeCurrency(currency: SarreCurrency): void {
    this.subject.next(currency);
  }

  currency = (str: string): string => {
    return str.toUpperCase() === SarreCurrency.NGN
      ? SarreCurrency.NGN_SYMBOL
      : SarreCurrency.USD_SYMBOL;
  }

}
