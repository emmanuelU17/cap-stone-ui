import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {ImageFilter} from "../../shared-util";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NewProductService {
  private HOST: string | undefined;
  private imageUrls$: BehaviorSubject<ImageFilter[]> = new BehaviorSubject<ImageFilter[]>([]);
  images$ = this.imageUrls$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  setImageUrl(arr: ImageFilter[]): void {
    this.imageUrls$.next(arr);
  }

  /**
   * Responsible for POST call to our server to create a new product
   * @param data of type FormData
   * @return Observable of type number
   * */
  create(data: FormData): Observable<number> {
    return this.http.post<HttpResponse<any>>(this.HOST + 'api/v1/worker/product', data, {
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

}
