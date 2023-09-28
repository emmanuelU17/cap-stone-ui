import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SizeInventoryService {

  private subject = new BehaviorSubject<boolean>(false);
  clearQueue = this.subject.asObservable();

  setSubject = (bool: boolean): void => this.subject.next(bool);

}
