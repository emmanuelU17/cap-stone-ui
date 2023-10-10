import {CollectionService} from "./shop/collection/collection.service";
import {Observable, tap} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

/** If collection is empty route to  */
export const COLLECTIONNOTEMPTY = (): Observable<boolean> => {
  const collectionService: CollectionService = inject(CollectionService);
  const router: Router = inject(Router);

  return collectionService.isEmpty$().pipe(
    tap((bool): void => {
      if (!bool) {
        router.navigate(['/shop/category']);
      }
    })
  );
}
