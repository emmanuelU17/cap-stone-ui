import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {AuthResponse} from "../../../global-utils/global-utils";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly HOST: string | undefined;
  private principal$ = new BehaviorSubject<AuthResponse>({ principal: '' });
  _principal$ = this.principal$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.HOST = environment.domain;
  }

  getActiveUser(): Observable<string> {
    const url = `${this.HOST}api/v1/client/auth`;
    return this.http.get<AuthResponse>(url, {
      responseType: 'json',
      withCredentials: true
    }).pipe(
      catchError((err) => {
        this.router.navigate(['/profile/authentication']);
        return of(err);
      }),
      map((res: AuthResponse) => {
        const principal: string = res.principal
        this.principal$.next({ principal: principal });
        return principal;
      })
    );
  }

}
