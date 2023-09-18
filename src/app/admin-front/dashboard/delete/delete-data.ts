import {Observable} from "rxjs";

export interface DeleteData<T> {
  name: string; // represents product, category or collection name
  asyncButton: Observable<T>; // represents api call observable
}
