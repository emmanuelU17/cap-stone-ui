import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SizeInventory} from "../../shared-util";
import {MatButtonModule} from "@angular/material/button";
import {CustomQueue} from "./custom-queue";

@Component({
  selector: 'app-size-inventory',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './size-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeInventoryComponent {
  queue = new CustomQueue<SizeInventory>();
  indexOfError = -1;

  @Output() eventEmitter = new EventEmitter<SizeInventory[]>();

  // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  private isNumeric = (num: any) =>
    (typeof (num) === 'number' || typeof (num) === 'string' && num.trim() !== '') && !isNaN(num as number);

  /**
   * Validates if size and quantity pair are in the right format
   * @return boolean
   * */
  invalidInputImpl = (): boolean => {
    if (this.queue.empty()) {
      return false;
    }

    for (let i = 0; i < this.queue.toArray().length; i++) {
      const obj = this.queue.toArray()[i]
      if (!this.isNumeric(obj.qty)|| obj.size === '' || obj.qty < 0) {
        this.indexOfError = i;
        return true;
      }
    }

    const end = this.queue.endOfQueue();
    return !this.isNumeric(end.qty) || end.qty < 0 || end.size === '';
  }

  addInputRow(): void {
    this.queue.addToQueue({size: '', qty: -1});
  }

  /**
   * Adds quantity based on the index into inputRow. More on getting user input
   * https://angular.io/guide/user-input
   *
   * @param event
   * @param index is the row on the html
   * */
  onKeyQty(event: KeyboardEvent, index: number): void {
    const qty: string = (event.target as HTMLInputElement).value;
    this.queue.toArray()[index].qty = Number(qty);
  }

  /**
   * Adds size based on the index into inputRow. More on getting user input
   * https://angular.io/guide/user-input
   *
   * @param event
   * @param index is the row on the html
   * */
  onKeySize(event: KeyboardEvent, index: number): void {
    this.queue.toArray()[index].size = (event.target as HTMLInputElement).value;
  }

  /**
   * Delete row from inputRow
   * @param index is the row to delete on the UI
   * @return void
   * */
  deleteRow(index: number): void {
    this.queue.toArray().splice(index, 1);
  }

  /** Updates parent content with array of SizeInventory */
  informParent(): void {
    this.eventEmitter.emit(this.queue.toArray());
  }
}
