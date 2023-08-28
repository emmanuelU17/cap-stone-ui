import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthMenuService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /** Api responsible for logging out a user */
  logoutApi(): Observable<number> {
    return this.http.post(`${this.HOST}api/v1/logout`, {}, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: any) => res === null ? 0 : res.status));
  }
}
