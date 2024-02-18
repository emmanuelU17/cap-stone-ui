import {inject, Injectable} from '@angular/core';
import {environment} from "@/environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of, switchMap, tap} from "rxjs";
import {ShippingDTO, ShipSettingMapper, TaxSetting} from "./util";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly HOST: string | undefined =  environment.domain;
  private readonly http = inject(HttpClient);
  private readonly shippingSubject = new BehaviorSubject<boolean>(false);
  private readonly taxSubject = new BehaviorSubject<boolean>(false);

  private tempShipSetting: ShipSettingMapper[] = [];
  private tempTaxSetting: TaxSetting[] = [];

  /**
   * Observable for refreshing ShipSettingMapper data triggered by a boolean value.
   *
   * This observable listens to changes in the BehaviorSubject 'shippingSubject'.
   * When a new boolean value is emitted, it triggers the refreshing of shipping data
   * by switching to the 'allShipping' observable if the boolean value is true.
   *
   * @returns An observable that emits an array of Shipping objects after refreshing.
   */
  readonly refreshShippingSetting$ = this.shippingSubject
    .asObservable()
    .pipe(switchMap((bool) => bool ? this.allShipping() : of(this.tempShipSetting)));

  /**
   * Observable for refreshing TaxSetting data triggered by a boolean value.
   *
   * This observable listens to changes in the BehaviorSubject 'taxSubject'.
   * When a new boolean value is emitted, it triggers the refreshing of tax data
   * by switching to the 'allTaxSetting' observable if the boolean value is true.
   *
   * @returns An observable that emits an array of TaxSetting objects after refreshing.
   */
  readonly refreshTaxSetting$ = this.taxSubject
    .asObservable()
    .pipe(switchMap((bool) => bool ? this.allTaxSetting() : of(this.tempTaxSetting)));

  /**
   * Retrieves all shipping data from the API.
   *
   * This method sends an HTTP GET request to the backend API to fetch all shipping data.
   * It returns an observable that emits an array of Shipping objects.
   *
   * @returns An observable that emits an array of {@link ShipSettingMapper} objects retrieved from the API.
   */
  readonly allShipping = (): Observable<ShipSettingMapper[]> => this.http
    .get<ShipSettingMapper[]>(`${this.HOST}api/v1/shipping`, { responseType: 'json', withCredentials: true })
    .pipe(tap((arr): void => { this.tempShipSetting = arr }));

  create = (obj: ShippingDTO): Observable<number> => this.http
    .post<ShippingDTO>(`${this.HOST}api/v1/shipping`, obj, { observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<ShippingDTO>) => {
        this.shippingSubject.next(true);
        return res.status;
      })
    );

  update = (obj: ShipSettingMapper): Observable<number> => this.http
    .put<ShipSettingMapper>(`${this.HOST}api/v1/shipping`, obj, { observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<ShipSettingMapper>) => {
        this.shippingSubject.next(true);
        return res.status;
      })
    );

  delete = (shippingId: number): Observable<number> => this.http
    .delete<any>(`${this.HOST}api/v1/shipping/${shippingId}`,{ observe: 'response', withCredentials: true })
    .pipe(
      map((res: HttpResponse<any>) => {
        this.shippingSubject.next(true);
        return res.status;
      })
    );

  readonly allTaxSetting = (): Observable<TaxSetting[]> => this.http
    .get<TaxSetting[]>(`${this.HOST}api/v1/tax`, { responseType: 'json', withCredentials: true })
    .pipe(tap((arr): void => { this.tempTaxSetting = arr }));

  updateTaxSetting = (obj: TaxSetting): Observable<number> => this.http
    .put<TaxSetting>(`${this.HOST}api/v1/tax`, obj, { observe: 'response', withCredentials: true })
    .pipe(
      map((obj: HttpResponse<TaxSetting>) => {
        this.taxSubject.next(true);
        return obj.status;
      })
    );

}
