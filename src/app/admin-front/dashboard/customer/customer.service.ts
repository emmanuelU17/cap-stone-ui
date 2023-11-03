import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Page, SarreUser} from "../../../global-utils";
import {ToastService} from "../../../service/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

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
