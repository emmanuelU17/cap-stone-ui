import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CollectionService} from "../collection.service";
import {ProductService} from "../../product/product.service";
import {Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CollectionResponse, TableContent} from "../../../shared-util";
import {catchError, combineLatest, map, Observable, of, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {DeleteComponent} from "../../util/delete/delete.component";
import {CommonModule} from "@angular/common";
import {DynamicTableComponent} from "../../util/dynamictable/dynamic-table.component";

@Component({
  selector: 'app-collection-impl',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule, RouterLink],
  template: `
    <div class="h-full py-0 px-2.5">

      <div class="py-2.5 px-0 flex">
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">collections</h1>
        <a routerLink="new" class="ml-1 bg-transparent">
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
        </a>
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionImplComponent {

  private readonly collectionService = inject(CollectionService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  data$ = this.collectionService._collections$;
  columns: Array<keyof CollectionResponse> = ['collection_id', 'collection', 'created_at', 'modified_at', 'visible', 'action'];

  /**
   * Based on the key received from DynamicTableComponent, route to the appropriate page
   * */
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
                  this.productService.allProducts(0, 20, currency))
                );
              const collections$ = this.collectionService.allCollections();

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
