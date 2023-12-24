import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {Observable, switchMap} from "rxjs";
import {Checkout} from "./index";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly footerService = inject(FooterService);

  /**
   * To prevent display payment button and to overselling, we need a response OK
   * */
  validate = (): Observable<Checkout> => this.footerService.currency$
    .pipe(
      switchMap((currency) => this.http
        .get<Checkout>(`${this.HOST}api/v1/payment?currency=${currency}`, { withCredentials: true })
      )
    );

}
