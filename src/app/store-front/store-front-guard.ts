import {CollectionService} from "./shop/collection/collection.service";
import {Observable} from "rxjs";
import {inject} from "@angular/core";

/** If collection is empty route to  */
export const COLLECTIONNOTEMPTY = (): Observable<boolean> => {
  const collectionService: CollectionService = inject(CollectionService);
  return collectionService.collectionNotEmpty$;
}
