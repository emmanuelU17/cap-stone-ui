import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor} from "@angular/common/http";
import {Observable} from "rxjs";

/** Intercepts every request to add a CSRF token */
@Injectable({
  providedIn: 'root'
})
export class CsrfInterceptor implements HttpInterceptor {

  tokenExtractor: HttpXsrfTokenExtractor = inject(HttpXsrfTokenExtractor);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName: string = 'X-XSRF-TOKEN';
    const token: string | null = this.tokenExtractor.getToken();

    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token) });
    }

    return next.handle(req);
  }

}
