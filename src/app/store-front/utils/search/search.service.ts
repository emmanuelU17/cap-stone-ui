import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private subject = new BehaviorSubject<boolean>(false);
  openSearchComponent$ = this.subject.asObservable();

  openComponent(bool: boolean): void {
    this.subject.next(bool);
  }

}
