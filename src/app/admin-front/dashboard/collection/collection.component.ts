import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionResponse, TableContent} from "../../shared-util";
import {CollectionService} from "./collection.service";
import {catchError, combineLatest, map, Observable, of, switchMap} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {Router} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";
import {DeleteComponent} from "../delete/delete.component";
import {ProductService} from "../product/product.service";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  templateUrl: './collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  private collectionService: CollectionService = inject(CollectionService);
  private productService: ProductService = inject(ProductService);
  private router: Router = inject(Router);
  private dialog: MatDialog = inject(MatDialog);

  data$: Observable<CollectionResponse[]> = this.collectionService._collections$;
  columns: Array<keyof CollectionResponse> = ['id', 'collection', 'created_at', 'modified_at', 'visible', 'action'];

  /** Based on the key received from DynamicTableComponent, route to the appropriate page */
  infoFromTableComponent(content: TableContent<CollectionResponse>): void {
    switch (content.key) {
      case 'view':
        break;
      case 'edit':
        this.router.navigate([`/admin/dashboard/collection/${content.data.id}`]);
        break;
      case 'delete':
        const obs: Observable<{ status: number, message: string }> = this.collectionService
          .deleteCollection(content.data.id)
          .pipe(
            switchMap((status: number) => {
              // Refresh Collection and Product Array
              const products$ = this.productService.fetchAllProducts();
              const collections$ = this.collectionService.fetchCollections();

              return of(status).pipe(
                switchMap((num: number) =>
                  combineLatest([products$, collections$])
                    .pipe(
                      map(() => ({ status: num, message: 'deleted!' }))
                    )
                )
              );
            }),
            catchError((err: HttpErrorResponse) => of({ status: err.status, message: err.error.message }))
          );

        this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: content.data.collection,
            asyncButton: obs
          }
        });

        break;
      default :
        console.error('Invalid key chosen');
    }
  }

}
