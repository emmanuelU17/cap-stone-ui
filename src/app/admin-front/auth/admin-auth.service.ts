import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable, of} from "rxjs";
import {LoginDTO} from "./util";
import {AuthResponse} from "../../global-utils";
import {Router} from "@angular/router";
import {ToastService} from "../../service/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly toastService: ToastService = inject(ToastService);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  /**
   * Logs in an Admin
   *
   * @param obj of type LoginDto
   * @return Observable of http status
   * */
  login(obj: LoginDTO): Observable<number> {
    const url = `${this.HOST}api/v1/worker/auth/login`;
    return this.http.post<AuthResponse>(url, obj, {
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
