import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Product} from "../store-front-utils";
import {Page, SarreCurrency} from "../../global-utils";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private subject = new BehaviorSubject<Product[]>([]);
  products$ = this.subject.asObservable()

  get bgImages(): string[] {
    return [
      'assets/image/sarre1.jpg',
      'assets/image/sarre2.jpg',
      'assets/image/sarre3.jpg',
    ]
  }

  homeProducts(currency: SarreCurrency): Observable<Product[]> {
    const url = `${this.HOST}api/v1/client/product?page=0&size=6&currency=${currency}`;
    return this.http.get<Page<Product>>(url, { withCredentials: true})
      .pipe(
        map((page) => {
          this.subject.next(page.content)
          return page.content;
        }),
      );
  }

}
