import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SizeInventory} from "../../shared-util";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-size-inventory',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './size-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeInventoryComponent {
  inputRow: SizeInventory[] = [];

  @Output() eventEmitter = new EventEmitter<SizeInventory[]>();

  constructor() { }

  // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  private isNumeric = (num: any) =>
    (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num as number);

  addInputRow(): void {
    this.inputRow.push({size: '', qty: -1});
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
    if (!this.isNumeric(qty)) {
      return;
    }
    this.inputRow[index].qty = Number(qty);
  }

  /**
   * Adds size based on the index into inputRow. More on getting user input
   * https://angular.io/guide/user-input
   *
   * @param event
   * @param index is the row on the html
   * */
  onKeySize(event: KeyboardEvent, index: number): void {
    this.inputRow[index].size = (event.target as HTMLInputElement).value;
  }

  /**
   * Delete row from inputRow
   * @param index is the row to delete on the UI
   * @return void
   * */
  deleteRow(index: number): void {
    if (index > -1) {
      this.inputRow.splice(index, 1);
    }
  }

  /** Updates parent content with array of SizeInventory */
  informParent(): void {
    for (let i = 0; i < this.inputRow.length; i++) {
      if (this.inputRow[i].size === '' || this.inputRow[i].qty < 0) {
        this.inputRow.splice(i, 1);
      }
    }

    if (this.inputRow.length === 0) {
      // this.toastService.createToast('Please enter a size and quantity for product');
      return;
    }

    // this.toastService.createToast('Saved Size and Quantity, waiting to for CREATE button to be clicked');

    this.eventEmitter.emit(this.inputRow);
  }
}
