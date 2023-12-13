import {inject, Injectable, signal} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import {AuthResponse, RegisterDTO} from "../global-utils";
import {ToastService} from "../shared-comp/toast/toast.service";
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
  private readonly sig = signal<string>('');

  principal = this.sig();

  /**
   * Retrieve CSRF token on load of application
   * */
  csrf = (): Observable<CSRF> => this.http.get<CSRF>(`${this.HOST}api/v1/csrf`, {withCredentials: true});

  /**
   * Returns user principal
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
        const principal = res.body.principal
        this.sig.set(principal);
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

  logout(path: string): Observable<number> {
    return this.http.post(`${this.HOST}api/v1/logout`, {}, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      map((res: any) => res === null ? 0 : res.status),
      tap(() => this.router.navigate([`${path}`]))
    );
  }

  register(obj: RegisterDTO, path: string, route?: string): Observable<number> {
    return this.http.post<RegisterDTO>(`${this.HOST}${path}`, obj, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<RegisterDTO>) => {
        this.toastService.toastMessage('registered!');
        if (route) {
          this.router.navigate([`${route}`]);
        }
        return res.status;
      }),
      catchError((err) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err);
      })
    );
  }

  login(obj: { principal: string, password: string }, path: string, route: string): Observable<number> {
    return this.http.post<AuthResponse>(`${this.HOST}${path}`, obj, {
      headers: { 'content-type': 'application/json' },
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<AuthResponse>) => {
        this.router.navigate([`${route}`]);
        return res.status;
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error ? err.error.message : err.message;
        this.toastService.toastMessage(message);
        return of(err.status);
      })
    );
  }

}
