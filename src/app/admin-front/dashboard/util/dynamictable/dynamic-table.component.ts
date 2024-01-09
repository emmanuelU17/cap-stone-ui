import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageChange, TableContent} from "../../../shared-util";
import {Page} from "../../../../global-utils";
import {PaginatorComponent} from "../../../../shared-comp/paginator/paginator.component";

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-transform: uppercase;
      }

      th, td {
        text-align: left;
        padding: 1rem;
        border-bottom: var(--cards-border);
      }

      @media screen and (max-width: 768px) {
        th, td, mat-icon {
          font-size: calc(10px + 1vw);
        }
      }
    `
  ],
  template: `
    <!-- Product Template -->
    <ng-container *ngIf="paginationTable">
      <div class="w-full rounded-md overflow-x-auto bg-[var(--white)]">
        <table>
          <thead>
          <tr>
            <th *ngFor="let col of tHead" [ngSwitch]="col">
              <!-- Do not show Description and ID -->
              <ng-container *ngSwitchCase="'product_id'">No.</ng-container>
              <ng-container *ngSwitchCase="'action'">Delete</ng-container>
              <ng-container *ngSwitchCase="'desc'"></ng-container>
              <ng-container *ngSwitchDefault>{{ col }}</ng-container>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr *ngFor="let data of pageData.content; let i = index;">
            <td *ngFor="let head of tHead">
              <ng-container [ngSwitch]="head">

                <ng-container *ngSwitchCase="'product_id'">
                  {{ (i + 1) + (currentPage() * 10) }}
                </ng-container>

                <!-- Image -->
                <div *ngSwitchCase="'image'" class="rounded overflow-hidden min-w-[2.75rem] min-h-[2.75rem] max-w-[7rem] max-h-[4rem]">
                  <img [src]="data[head]" alt="image" class="w-full h-full object-cover object-center">
                </div>

                <!-- Product Name -->
                <ng-container *ngSwitchCase="'name'">
                  <div>
                    <button
                      (click)="onclickProduct(data,'product')"
                      class="outline-none bg-transparent text-blue-400 hover:border-b hover:border-blue-500"
                      type="button"
                    >{{ data[head] }}</button>
                  </div>
                </ng-container>

                <div *ngSwitchCase="'action'">
                  <!-- Delete button -->
                  <button type="button" (click)="onclickProduct(data,'delete')" class="outline-none border-none bg-transparent text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                    </svg>
                  </button>
                </div>

                <!-- Do not show Description -->
                <ng-container *ngSwitchCase="'desc'"></ng-container>

                <!-- Visible -->
                <div *ngSwitchCase="'is_visible'" [style]="{ 'color': data[head] === true ? 'green' : 'red' }">
                  {{ data[head] }}
                </div>

                <!-- Default -->
                <div *ngSwitchDefault>{{ data[head] }}</div>
              </ng-container>
            </td>

          </tr>
          </tbody>
        </table>

        <div class="w-full mt-6 p-1.5">
          <app-paginator
            [currentPage]="pageData.number"
            [totalPages]="pageData.size"
            [totalElements]="pageData.totalElements"
            (goTo)="onPageNumber($event)"
          ></app-paginator>
        </div>

      </div>
    </ng-container>

    <!-- None Product Template (no need for pagination) -->
    <ng-container *ngIf="!paginationTable">
      <table class="table-auto">
        <thead>
        <tr>
          <th *ngFor="let col of tHead" [ngSwitch]="col">
            <!-- Do not show Description and ID -->
            <ng-container *ngSwitchCase="'category_id'">No.</ng-container>
            <ng-container *ngSwitchCase="'collection_id'">No.</ng-container>
            <ng-container *ngSwitchCase="'index'">No.</ng-container>
            <ng-container *ngSwitchCase="'collection'">Name</ng-container>
            <ng-container *ngSwitchCase="'category'">Name</ng-container>
            <ng-container *ngSwitchCase="'created_at'">Created Date</ng-container>
            <ng-container *ngSwitchCase="'modified_at'">Modified Date</ng-container>
            <ng-container *ngSwitchCase="'action'">Delete</ng-container>
            <ng-container *ngSwitchCase="'is_visible'">visible</ng-container>
            <ng-container *ngSwitchCase="'visible'">visible</ng-container>
            <ng-container *ngSwitchDefault>{{ col }}</ng-container>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr *ngFor="let d of data; let i = index">
          <td class="cursor-pointer" *ngFor="let head of tHead" (click)="onClick(d,'view')">
            <ng-container [ngSwitch]="head">

              <!-- Image -->
              <div class="rounded overflow-hidden min-w-[2.75rem] min-h-[2.75rem] max-w-[7rem] max-h-[4rem]"
                   *ngSwitchCase="'url'">
                <img [src]="d[head]" alt="image" class="w-full h-full object-cover object-center">
              </div>

              <!-- Buttons -->
              <div class="flex" *ngSwitchCase="'action'">
                <!-- Delete button -->
                <button type="button" (click)="onClick(d,'delete')" class="outline-none border-none bg-transparent text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
                </button>
              </div>

              <ng-container *ngSwitchCase="'category_id'">{{ i + 1 }}</ng-container>
              <ng-container *ngSwitchCase="'collection_id'">{{ i + 1 }}</ng-container>
              <ng-container *ngSwitchCase="'index'">{{ i + 1 }}</ng-container>

              <!-- Created and Modified At -->
              <ng-container *ngSwitchCase="'created_at'">{{ date(d[head]) }}</ng-container>
              <ng-container *ngSwitchCase="'modified_at'">{{ date(d[head]) }}</ng-container>

              <!-- Do not show ID -->
              <div *ngSwitchCase="'id'"></div>

              <!-- Visible -->
              <div *ngSwitchCase="'is_visible'" [style]="{ 'color': d[head] === true ? 'green' : 'red' }">
                {{ d[head] }}
              </div>

              <div *ngSwitchCase="'visible'" [style]="{ 'color': d[head] === true ? 'green' : 'red' }">
                {{ d[head] }}
              </div>

              <!-- Category -->
              <button
                *ngSwitchCase="'category'"
                (click)="onClick(d,'edit')"
                type="button"
                class="outline-none bg-transparent text-blue-400 hover:border-b hover:border-blue-500"
              >{{ d[head] }}</button>

              <!-- Collection -->
              <button
                *ngSwitchCase="'collection'"
                (click)="onClick(d,'edit')"
                type="button"
                class="outline-none bg-transparent text-blue-400 hover:border-b hover:border-blue-500"
              >{{ d[head] }}</button>

              <!-- SKU -->
              <button
                *ngSwitchCase="'sku'"
                (click)="onClick(d,'edit')"
                type="button"
                class="outline-none bg-transparent text-blue-400 hover:border-b hover:border-blue-500"
              >{{ d[head] }}</button>

              <!-- Default -->
              <div *ngSwitchDefault>{{ d[head] }}</div>

            </ng-container>
          </td>
        </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent<T> {

  // TODO validate why current pages isn't changing on html
  protected readonly currentPage = signal<number>(0);

  @Input() paginationTable: boolean = false; // validates if pagination table should be rendered
  @Input() tHead: (keyof T)[] = [];
  @Input() detail: boolean = false; // verifies if details button should be displayed
  @Input() data: T[] = [];
  @Input() pageData!: Page<T>;
  @Output() eventEmitter = new EventEmitter<TableContent<T>>();
  @Output() pageEmitter = new EventEmitter<PageChange>();

  date = (d: any): string => d === 0 ? '' : new Date(d).toDateString();

  /**
   * Informs Parent component. Note the table clicked on is the table that does not require pagination
   *
   * @param data represents the row details
   * @param key can either be detail, edit or delete
   * @return void
   * */
  onClick = (data: T, key: string): void => this.eventEmitter.emit({ data: data, key: key });

  /**
   * Informs Product Component on the row clicked. Requires pagination
   * */
  onclickProduct = (data: T, key: string): void => this.eventEmitter.emit({ data: data, key: key });

  /**
   * Emits page number clicked
   * */
  onPageNumber(pageNumber: number): void {
    this.currentPage.set(pageNumber);
    this.pageEmitter.emit({ page: pageNumber, size: 20 });
  }

}
