import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {Filter} from "../../shop/shop.helper";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T> {
  indexToOpen: number = -1;
  @Input() title: string = '';
  @Input() filters: Filter<T>[] = [];
  @Output() emitter = new EventEmitter<T>();

  constructor(private render: Renderer2) { }

  /** Close filter component */
  closeModal(): void {
    this.render.selectRootElement('.filter-btn', true).style.display = 'none';
  }

  /**
   * Toggles contents of each row when clicked
   * @param index is the index of Filter content in the array
   * @return void
   * */
  toggleSection(index: number): void {
    // Toggle + and - svg
    this.filters[index].isOpen = !this.filters[index].isOpen;

    // Close content if it is visible
    if (index === this.indexToOpen) {
      this.indexToOpen = -1;
      return;
    }
    this.indexToOpen = index;
  }

  /**
   * Updates parent component on what category or collection is clicked.
   * @param generic is the value. It is a generic type because it can be of type string or number
   * @return void
   * */
  childClicked(generic: T): void {
    this.emitter.emit(generic);
  }
}
