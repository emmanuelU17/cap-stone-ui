import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import {Page, SarreUser} from "../../../global-utils";
import {RegisterDTO} from "./customer.routes";
import {ToastService} from "../../../service/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  /**
   * Registers a new Admin
   *
   * @param obj of type RegisterDTO
   * @return Observable of number which is the response status
   * */
  registerUser(obj: RegisterDTO): Observable<number> {
    const url: string = `${this.HOST}api/v1/worker/auth/register`;
    return this.http.post<RegisterDTO>(url, obj, {
      headers: {'content-type': 'application/json'},
      observe: 'response',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<RegisterDTO>) => res.status),
      tap((status) => {
        if (status >= 200 && status < 300) {
          this.toastService.toastMessage('Registered!');
        }
      }),
      catchError((err) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err);
      })
    );
  }

  /** Returns a page of users from server */
  allUsers(page: number = 0, size: number = 20): Observable<Page<SarreUser>> {
    const url = `${this.HOST}api/v1/worker/user?page=${page}&size=${size}`
    return this.http.get<Page<SarreUser>>(url, {
      observe: 'body',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      catchError((err) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err);
      })
    );
  }

}
