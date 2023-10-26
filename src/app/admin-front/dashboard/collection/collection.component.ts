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
  template: `
    <div class="h-full py-0 px-2.5">

      <div class="py-2.5 px-0 flex">
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">collections</h1>
        <button type="button" class="ml-1 bg-transparent" (click)="routeToNewCollection()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-[var(--app-theme)]"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      <div class="px-0" *ngIf="data$ | async as data">
        <app-dynamic-table
          [detail]="false"
          [tHead]="columns"
          [data]="data"
          (eventEmitter)="infoFromTableComponent($event)"
        ></app-dynamic-table>
      </div>

    </div>
  `,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {

  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);

  data$: Observable<CollectionResponse[]> = this.collectionService._collections$;
  columns: Array<keyof CollectionResponse> = ['collection_id', 'collection', 'created_at', 'modified_at', 'visible', 'action'];

  routeToNewCollection = (): void => {
    this.router.navigate(['/admin/dashboard/new-collection']);
  }

  /** Based on the key received from DynamicTableComponent, route to the appropriate page */
  infoFromTableComponent(content: TableContent<CollectionResponse>): void {
    switch (content.key) {
      case 'view':
        break;

      case 'edit':
        this.router.navigate([`/admin/dashboard/collection/${content.data.collection_id}`]);
        break;

      case 'delete': {
        // Build response
        const obs: Observable<{ status: number, message: string }> = this.collectionService
          .deleteCollection(content.data.collection_id)
          .pipe(
            switchMap((status: number) => {
              // Refresh Collection and Product Array
              const products$ = this.productService.currency$
                .pipe(switchMap((currency) =>
                  this.productService.fetchAllProducts(0, 20, currency))
                );
              const collections$ = this.collectionService.fetchCollections();

              return of(status).pipe(
                switchMap((num: number) =>
                  combineLatest([products$, collections$])
                    .pipe(map(() => ({ status: num, message: 'deleted!' })))
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
      }

      default: console.error('Invalid key chosen');
    }
  }

}
