import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewProductService {
  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  /**
   * POST call to create a new product
   *
   * @param data of type FormData
   * @return Observable of type number
   * */
  create(data: FormData): Observable<number> {
    const url = `${this.HOST}api/v1/worker/product`;
    return this.http
      .post<HttpResponse<any>>(url, data, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(map((res: HttpResponse<any>) => res.status));
  }
}
