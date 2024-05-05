import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SarreCurrency } from '@/app/global-utils';
import { Checkout } from '@/app/store-front/order';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /**
   * Makes call to server to sum up total with shipping and tax included. calculate a users total based on the address.
   * */
  checkout = (country: string, currency: SarreCurrency) =>
    this.http.get<Checkout>(
      `${this.HOST}api/v1/checkout?country=${country}&currency=${currency}`,
      { withCredentials: true },
    );
}
