import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderHistoryDTO } from './overview/util';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  orderHistory = (): Observable<OrderHistoryDTO[]> =>
    this.http.get<OrderHistoryDTO[]>(`${this.HOST}api/v1/order`, {
      withCredentials: true,
    });
}
