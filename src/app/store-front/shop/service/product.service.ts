import {inject, Injectable, NgZone} from '@angular/core';
import {Observable, Subscriber} from "rxjs";
import {ProductDetail} from "../shop.helper";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  HOST: string | undefined = environment.domain;

  private readonly zone: NgZone = inject(NgZone);

  /**
   * Returns ProductDetails based on Product id
   * @param uuid is product id
   * @return Observable array of ProductDetails
   * */
  productDetailsByProductUUID(uuid: string): Observable<ProductDetail[]> {
    const url: string = `${this.HOST}api/v1/client/product/detail?product_id=${uuid}`;
    const source = new EventSource(url);

    return new Observable((observer: Subscriber<ProductDetail[]>): void => {
      // Response
      source.onmessage = (event: MessageEvent): void => {
        this.zone.run(() => observer.next(JSON.parse(event.data)));
      }

      // Error
      source.onerror = (error: Event): void => {
        if (error.eventPhase !== EventSource.CLOSED) {
          this.zone.run(() => observer.error(error));
        }
      }
    });
  }

}
