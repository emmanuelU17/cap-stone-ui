import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {PageChange, TableContent} from "../../shared-util";
import {Page} from "../../../../global-utils/global-utils";

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent<T> {
  @Input() productTemplate: boolean = false; // Validates what table to show
  @Input() tHead: (keyof T)[] = [];
  @Input() detail: boolean = false; // verifies if details button should be displayed
  @Output() eventEmitter = new EventEmitter<TableContent<T>>();
  @Output() pageEmitter: EventEmitter<PageChange> = new EventEmitter<PageChange>();

  @Input() data: T[] = [];

  @Input() pageData!: Page<T>;

  date(d: any): string {
    return d === 0 ? '' : new Date(d).toDateString();
  }

  /** Updates datasource to be rendered on table when next button is clicked */
  changePage(event: PageEvent): void {
    // TODO inform parent component of page change request
    this.pageEmitter.emit({page: event.pageIndex, size: event.pageSize});
  }

  /**
   * Informs Parent component. Note the table clicked on is the table that does not require pagination
   * @param data represents the row details
   * @param key can either be detail, edit or delete
   * @return void
   * */
  onClick(data: T, key: string): void {
    this.eventEmitter.emit({data: data, key: key});
  }

  /** Informs Product Component on the row clicked. Requires pagination */
  onclickProduct(data: T, key: string): void {
    this.eventEmitter.emit({data: data, key: key});
  }
}
