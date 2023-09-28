import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable, of} from "rxjs";
import {LoginDTO, RegisterDTO} from "./util";
import {AuthResponse} from "../../global-utils";
import {Router} from "@angular/router";
import {ToastService} from "../../service/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  HOST: string | undefined = environment.domain;

  private readonly toastService: ToastService = inject(ToastService);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  /**
   * Registers a new Admin
   *
   * @param obj
   * @return Observable of status
   * */
  register(obj: RegisterDTO): Observable<number> {
    const url: string = `${this.HOST}api/v1/worker/auth/register`;
    return this.http.post<HttpResponse<RegisterDTO>>(url, obj, {
      headers: {'content-type': 'application/json'},
      withCredentials: true
    }).pipe(map((res: HttpResponse<RegisterDTO>) => res.status));
  }

  /**
   * Logs in an Admin
   *
   * @param obj of type LoginDto
   * @return Observable of http status
   * */
  login(obj: LoginDTO): Observable<number> {
    return this.http.post<AuthResponse>(this.HOST + 'api/v1/worker/auth/login', obj, {
      headers: {'content-type': 'application/json'},
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<AuthResponse>) => {
        this.router.navigate(['/admin/dashboard']);
        return res.status;
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

}
