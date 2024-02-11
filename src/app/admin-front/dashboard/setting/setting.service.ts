import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of, switchMap, tap} from "rxjs";
import {ShippingDTO, ShippingSettingMapper} from "./util";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly HOST: string | undefined =  environment.domain;
  private readonly http = inject(HttpClient);
  private readonly subject = new BehaviorSubject<boolean>(false);

  private temp: ShippingSettingMapper[] = [];

  /**
   * Observable for refreshing ShippingSetting data triggered by a boolean value.
   *
   * This observable listens to changes in the BehaviorSubject 'subject'.
   * When a new boolean value is emitted, it triggers the refreshing of shipping data
   * by switching to the 'allShipping' observable if the boolean value is true.
   *
   * @returns An observable that emits an array of Shipping objects after refreshing.
   */
  readonly refreshShippingSetting$ = this.subject
    .asObservable()
    .pipe(switchMap((bool) => bool ? this.allShipping() : of(this.temp)));

  /**
   * Emits a boolean value to trigger the refresh of the ShippingSetting data observable.
   *
   * This method updates the BehaviorSubject with the provided boolean value,
   * which in turn triggers the refreshing of the ShippingSetting data observable.
   *
   * @param bool A boolean value indicating whether to refresh the shipping data.
   */
  refreshShippingSettingObservable = (bool: boolean): void => this.subject.next(bool);

  /**
   * Retrieves all shipping data from the API.
   *
   * This method sends an HTTP GET request to the backend API to fetch all shipping data.
   * It returns an observable that emits an array of Shipping objects.
   *
   * @returns An observable that emits an array of ShippingSetting objects retrieved from the API.
   */
  readonly allShipping = (): Observable<ShippingSettingMapper[]> => this.http
    .get<ShippingSettingMapper[]>(`${this.HOST}api/v1/shipping`, { responseType: 'json', withCredentials: true })
    .pipe(tap((arr): void => { this.temp = arr }));

  create = (obj: ShippingDTO): Observable<number> => this.http
    .post<ShippingDTO>(`${this.HOST}api/v1/shipping`, obj, { observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<ShippingDTO>) => {
        this.refreshShippingSettingObservable(true);
        return res.status;
      })
    );

  update = (obj: ShippingSettingMapper): Observable<number> => this.http
    .put<ShippingSettingMapper>(`${this.HOST}api/v1/shipping`, obj, { observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<ShippingSettingMapper>) => {
        this.refreshShippingSettingObservable(true);
        return res.status;
      })
    );

  delete = (shippingId: number): Observable<number> => this.http
    .delete<any>(`${this.HOST}api/v1/shipping/${shippingId}`,{ observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<any>) => {
        this.refreshShippingSettingObservable(true);
        return res.status;
      })
    );

  // updateTax(): Observable<number>

}
