import {inject, Injectable} from '@angular/core';
import {environment} from "@/environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {AuthResponse, RegisterDTO} from "@/app/global-utils";
import {ToastService} from "@/app/shared-comp/toast/toast.service";
import {Router} from "@angular/router";

interface CSRF {
  token: string;
  parameterName: string;
  headerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly HOST: string | undefined =  environment.domain;

  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly subject = new BehaviorSubject<string>('');

  readonly principal$ = this.subject.asObservable();

  /**
   * Retrieve CSRF token on load of application
   * */
  csrf = (): Observable<CSRF> => this.http
    .get<CSRF>(`${this.HOST}api/v1/csrf`, { withCredentials: true });

  /**
   * Returns current user principal
   * */
  activeUser = (url: string, route: string, bool: boolean) => this.http
    .get<AuthResponse>(`${this.HOST}${url}`, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<AuthResponse>): string => {
        if (res.body === null) {
          return '';
        }
        this.subject.next(res.body.principal);
        return res.body.principal;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error ? err.error.message : err.message;
        this.router.navigate([`${route}`]);
        if (bool) {
          this.toastService.toastMessage(message);
        }
        return of(message);
      })
    );

  logout = (path: string): Observable<number> => this.http
    .post(
      `${this.HOST}api/v1/logout`,
      {},
      { observe: 'response',  withCredentials: true }
    )
    .pipe(
      map((res: any) => res === null ? 0 : res.status),
      tap(() => this.router.navigate([`${path}`]))
    );

  header = { 'content-type': 'application/json' };

  register = (obj: RegisterDTO, path: string, route?: string): Observable<number> =>this.http
    .post<RegisterDTO>(
      `${this.HOST}${path}`,
      obj,
      { headers: this.header, observe: 'response', withCredentials: true }
    )
    .pipe(
      map((res: HttpResponse<RegisterDTO>) => {
        this.toastService.toastMessage('registered!');
        if (route) {
          this.router.navigate([`${route}`]);
        }
        return res.status;
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastService.toastMessage(e.error ? e.error.message : e.message);
        return of(e.status);
      })
    );

  login = (obj: { principal: string, password: string }, path: string, route: string): Observable<number> => this.http
    .post<AuthResponse>(`${this.HOST}${path}`, obj, {
      headers: this.header,
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    })
    .pipe(
      map((res: HttpResponse<AuthResponse>) => {
        this.router.navigate([`${route}`]);
        return res.status;
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error ? err.error.message : err.message);
        return of(err.status);
      })
    );

}
