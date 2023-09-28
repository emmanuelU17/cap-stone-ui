import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthResponse} from "../../global-utils";
import {ToastService} from "../../service/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);
  private readonly toastService: ToastService = inject(ToastService);

  private readonly principal$ = new BehaviorSubject<AuthResponse>({ principal: '' });
  _principal$ = this.principal$.asObservable();

  getUser(): Observable<string> {
    const url = `${this.HOST}api/v1/worker/auth`;
    return this.http.get<AuthResponse>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<AuthResponse>) => res.body === null ? '' : res.body.principal),
      tap((principal: string) => this.principal$.next({ principal: principal })),
      catchError((err) => {
        this.router.navigate(['/admin']);
        this.toastService.toastMessage(err.error.message);
        return of(err);
      }),
    );
  }

}
