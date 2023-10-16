import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {CSRF} from "../global-utils";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http: HttpClient = inject(HttpClient);

  /** Retrieve CSRF token on load of application */
  csrf(): Observable<CSRF> {
    const url: string = `${this.HOST}api/v1/auth/csrf`;
    return this.http.get<CSRF>(url, { withCredentials: true });
  }

}
