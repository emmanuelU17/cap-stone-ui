import {Observable} from "rxjs";

export interface DeleteData<T> {
  name: string; // represents product, category or collection name
  obs: Observable<T>;
}
