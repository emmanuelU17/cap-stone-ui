import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthResponse} from "../global-utils";
import {ToastService} from "../shared-comp/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly subject = new BehaviorSubject<AuthResponse>({ principal: '' });
  principal$ = this.subject.asObservable();

  /**
   * Validates if user is logged in
   * */
  isLoggedIn = (url: string, route: string, errorRoute: string): Observable<unknown> => this.http
    .get<AuthResponse>(`${this.HOST}${url}`, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    })
    .pipe(
      tap((res: HttpResponse<AuthResponse>): void => {
        // user is signed in
        if (res.status >= 200 && res.status < 300) {
          this.router.navigate([`${route}`]);
          this.toastService.toastMessage('please sign out');
        }
      }),
      catchError((err) => {
        this.router.navigate([`${errorRoute}`]);
        return err;
      })
    );

  /**
   * Returns a user principal
   * */
  getUser(url: string, route: string, bool: boolean): Observable<string> {
    return this.http.get<AuthResponse>(`${this.HOST}${url}`, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<AuthResponse>): string => {
        if (res.body === null) {
          return '';
        }

        const principal = res.body.principal
        this.subject.next({ principal: principal })
        return principal;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error ? err.error.message : err.message;
        this.router.navigate([`${route}`]);
        if (bool) {
          this.toastService.toastMessage(message);
        }
        return of(message);
      }),
    );
  }

}
