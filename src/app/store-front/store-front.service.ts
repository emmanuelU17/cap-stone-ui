import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {webSocket} from "rxjs/webSocket";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreFrontService {
  HOST: string | undefined;

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  webSocketConnection(): Observable<unknown> {
    // const url = `${this.HOST}ws`
    const url = `ws://localhost:1997/`
    return webSocket(url)
      .asObservable()
      .pipe(
        tap((res): void => {
          console.log('Web socket response ', res)
        })
      );
  }


}
