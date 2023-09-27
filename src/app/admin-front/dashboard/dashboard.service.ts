import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthResponse} from "../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly HOST: string | undefined;

  private principal$ = new BehaviorSubject<AuthResponse>({ principal: '' });
  _principal$ = this.principal$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.HOST = environment.domain;
  }

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
        return of(err);
      }),
    );
  }

}
