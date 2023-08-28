import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {AuthResponse, LoginDto, RegisterDto} from "./util";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  /**
   * Method responsible for registering a user. It returns an Observable of number to validate if the request returned
   * a 201
   * @param obj
   * @return Observable of status
   * */
  register(obj: RegisterDto): Observable<number> {
    const url: string = `${this.HOST}api/v1/worker/auth/register`;
    return this.http.post<HttpResponse<RegisterDto>>(url, obj, {
      headers: {'content-type': 'application/json'},
      withCredentials: true
    }).pipe(map((res: HttpResponse<RegisterDto>) => res.status));
  }

  /**
   * Logs in a user. Method updates LOGGEDSESSION inorder to display dashboard
   * @param obj
   * @return Observable of http status
   * */
  login(obj: LoginDto): Observable<number> {
    return this.http.post<AuthResponse>(this.HOST + 'api/v1/worker/auth/login', obj, {
      headers: {'content-type': 'application/json'},
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(map((res: HttpResponse<AuthResponse>) => res.status));
  }

}
