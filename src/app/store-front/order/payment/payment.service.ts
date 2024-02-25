import {inject, Injectable, signal} from '@angular/core';
import {environment} from "@/environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "@/app/store-front/utils/footer/footer.service";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {PaymentDetail, ReservationDto} from "../index";
import {ToastService} from "@/app/shared-comp/toast/toast.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly footerService = inject(FooterService);
  private readonly router = inject(Router);

  private readonly country = signal<string>('');
  private readonly addressSubject = new BehaviorSubject<ReservationDto | undefined>(undefined);
  readonly address$ = this.addressSubject
    .asObservable()
    .pipe(
      tap((dto) => {
        if (!dto)
          this.router.navigate(['/checkout']);
        else
          this.country.set(dto.country);
      })
    );

  setAddress = (dto: ReservationDto): void => this.addressSubject.next(dto);

  toast = (message: string): void => this.toastService.toastMessage(message);

  /**
   * Api call to server to prevent overselling before displaying page
   * */
  validate = (): Observable<PaymentDetail> => this.footerService.currency$
    .pipe(
      switchMap((currency) => this.http
        .get<PaymentDetail>(
          `${this.HOST}api/v1/payment?currency=${currency}&country=${this.country()}`,
          {
            headers: { 'content-type': 'application/json' },
            observe: 'response',
            responseType: 'json',
            withCredentials: true
          }
        )
        .pipe(
          map((res) => {
            const body: PaymentDetail | null = res.body;
            if (body === null)
              throw new Error('an error occurred loading payment page.');
            return body;
          }),
          catchError((err: HttpErrorResponse) => {
            this.toast(err.error ? err.error.message : err.message);
            this.router.navigate(['/checkout']);
            return of();
          })
        )
      )
    );
}
