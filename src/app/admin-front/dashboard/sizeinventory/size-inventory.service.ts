import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SizeInventoryService {

  private subject = new BehaviorSubject<boolean>(false);
  clearQueue$ = this.subject.asObservable();

  /**
   * Clears SizeInventory array if @param is true
   *
   * @param bool of type boolean
   * */
  setSubject = (bool: boolean): void => this.subject.next(bool);

}
