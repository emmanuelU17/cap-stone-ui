import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessfulPayment } from '@/app/store-front/order/success-payment/index';

@Injectable({
  providedIn: 'root',
})
export class SuccessPaymentService {
  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  orderByReference = (reference: string): Observable<SuccessfulPayment> =>
    this.http.get<SuccessfulPayment>(
      `${this.HOST}api/v1/payment/${reference}`,
      { responseType: 'json' },
    );
}
