import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FooterService} from "../utils/footer/footer.service";
import {BehaviorSubject, catchError, Observable, of, switchMap, tap} from "rxjs";
import {PaymentDTO, ReservationDTO} from "./index";
import {ToastService} from "../../shared-comp/toast/toast.service";
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

  private readonly addressSubject = new BehaviorSubject<ReservationDTO | undefined>(undefined);
  readonly address$ = this.addressSubject.asObservable()
    .pipe(tap((dto) => { if (!dto) this.router.navigate(['/checkout']); }));

  setAddress = (dto: ReservationDTO): void => this.addressSubject.next(dto);

  toast = (message: string): void => this.toastService.toastMessage(message);

  /**
   * Api call to server to prevent overselling before displaying page
   * */
  validate = (): Observable<PaymentDTO> => this.footerService.currency$.pipe(
    switchMap((currency) => this.http
      .get<PaymentDTO>(`${this.HOST}api/v1/payment?currency=${currency}`, { withCredentials: true })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toast(err.error ? err.error.message : err.message);
          this.router.navigate(['/checkout']);
          return of();
        })
      )
    )
  )
}
