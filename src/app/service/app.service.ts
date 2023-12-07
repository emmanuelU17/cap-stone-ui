import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CSRF} from "../global-utils";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /**
   * Retrieve CSRF token on load of application
   * */
  csrf(): Observable<CSRF> {
    return this.http
      .get<CSRF>(`${this.HOST}api/v1/csrf`, { withCredentials: true });
  }

}
