import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {AuthResponse, RegisterDTO} from "../global-utils";
import {ToastService} from "./toast/toast.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly HOST: string | undefined =  environment.domain;

  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly router: Router = inject(Router);

  register(obj: RegisterDTO, path: string, route?: string): Observable<number> {
    const url = `${this.HOST}${path}`;
    return this.http.post<RegisterDTO>(url, obj, {
        headers: { 'content-type': 'application/json' },
        observe: 'response',
        withCredentials: true
    }).pipe(
      map((res: HttpResponse<RegisterDTO>) => {
        this.toastService.toastMessage('Registered!');
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

  login(
    obj: { principal: string, password: string },
    path: string,
    route: string
  ): Observable<number> {
    const url = `${this.HOST}${path}`;
    return this.http.post<AuthResponse>(url, obj, {
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
