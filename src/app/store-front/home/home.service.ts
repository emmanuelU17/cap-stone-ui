import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {HomeResponse} from "./homeResponse";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  HOST: string | undefined;

  private bgImages$ = new BehaviorSubject<string[]>([]);
  _bgImage$ = this.bgImages$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  get getImages(): string[] {
    return this.bgImages$.getValue();
  }

  /** Retrieve home background image on load of application */
  fetchHomeBackground(): Observable<string[]> {
    const url: string = `${this.HOST}api/v1/home`;
    return this.http.get<HomeResponse[]>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<HomeResponse[]>): string[] =>
        res.body === null ? [] : res.body.map((url: HomeResponse) => url.url)
      ),
      tap((arr: string[]) => this.bgImages$.next(arr))
    );
  }

}
