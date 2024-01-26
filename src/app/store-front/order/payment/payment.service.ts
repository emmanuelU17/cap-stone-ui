import {inject, Injectable, signal} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../../utils/footer/footer.service";
import {BehaviorSubject, catchError, Observable, of, switchMap, tap} from "rxjs";
import {PaymentDetails, ReservationDTO} from "../index";
import {ToastService} from "../../../shared-comp/toast/toast.service";
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
  private readonly addressSubject = new BehaviorSubject<ReservationDTO | undefined>(undefined);
  readonly address$ = this.addressSubject
    .asObservable()
    .pipe(
      tap((dto): void =>
        { if (!dto) this.router.navigate(['/checkout']); else this.country.set(dto.country); }
      )
    );

  setAddress = (dto: ReservationDTO): void => this.addressSubject.next(dto);

  toast = (message: string): void => this.toastService.toastMessage(message);

  /**
   * Api call to server to prevent overselling before displaying page
   * */
  validate = (): Observable<PaymentDetails> => this.footerService.currency$
    .pipe(
      switchMap((currency) => this.http
        .post<PaymentDetails>(
          `${this.HOST}api/v1/payment?currency=${currency}&country=${this.country()}`,
          {
            headers: { 'content-type': 'application/json' },
            observe: 'response',
            withCredentials: true
          }
        )
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.toast(err.error ? err.error.message : err.message);
            this.router.navigate(['/checkout']);
            return of();
          })
        )
      )
    );
}
