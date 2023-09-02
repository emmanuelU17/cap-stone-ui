import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {CSRF} from "../global-utils";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /** Retrieve CSRF token on load of application */
  csrf(): Observable<CSRF> {
    const url: string = `${this.HOST}api/v1/auth/csrf`;
    return this.http.get<CSRF>(url, { withCredentials: true });
  }

}
