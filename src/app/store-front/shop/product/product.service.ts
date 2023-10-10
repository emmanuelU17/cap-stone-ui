import {inject, Injectable, NgZone} from '@angular/core';
import {map, Observable, Subscriber} from "rxjs";
import {ProductDetail, SHOP_CONSTANT} from "../shop.helper";
import {environment} from "../../../../environments/environment";
import {Product} from "../../store-front-utils";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  productDetailsByProductUUID(uuid: string): Observable<ProductDetail[]> {
    const url: string = `${this.HOST}api/v1/client/product/detail?product_id=${uuid}`;
    return this.http.get<ProductDetail[]>(url, {
      withCredentials: true
    })
  }

  // private readonly zone: NgZone = inject(NgZone);
  // /**
  //  * Returns ProductDetails based on Product id.
  //  * Note: we're mapping the necessary details passed from either
  //  * Category or Collection components.
  //  *
  //  * @param uuid is product id
  //  * @return Observable array of ProductDetails
  //  * */
  // productDetailsByProductUUID(uuid: string): Observable<ProductDetail[]> {
  //   const url: string = `${this.HOST}api/v1/client/product/detail?product_id=${uuid}`;
  //
  //   const json: string | null = sessionStorage.getItem(SHOP_CONSTANT.PRODUCT);
  //
  //   let product: Product | null = null;
  //
  //   if (json) {
  //     product = JSON.parse(json) as Product;
  //   }
  //
  //   // Article on EventSource
  //   // https://medium.com/@chrisbautistaaa/server-sent-events-in-angular-node-908830cc29aa
  //   const source = new EventSource(url);
  //   return new Observable((observer: Subscriber<ProductDetail[]>) => {
  //     // Response
  //     source.onmessage = (event: MessageEvent): void => {
  //       this.zone.run(() => observer.next(JSON.parse(event.data)));
  //     }
  //     // Error
  //     source.onerror = (error: Event): void => {
  //       if (error.eventPhase !== EventSource.CLOSED) {
  //         this.zone.run(() => observer.error(error));
  //       }
  //     }
  //     // Complete
  //     return (): void => source.close();
  //   }).pipe(
  //     map((arr: ProductDetail[]) => {
  //       return arr.map((d: ProductDetail) => {
  //         if (product) {
  //           d.desc = product.desc;
  //           d.currency = product.currency;
  //           d.price = product.price;
  //           d.name = product.name;
  //         }
  //
  //         return d;
  //       });
  //     })
  //   );
  // }

}
