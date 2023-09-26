import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, Renderer2} from '@angular/core';
import {Filter} from "../../shop/shop.helper";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T> {
  private render: Renderer2 = inject(Renderer2);

  @Input() title: string = '';
  @Input() filters: Filter<T>[] = [];
  @Output() emitter = new EventEmitter<T>();

  indexToOpen: number = -1;

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
    this.indexToOpen = (index === this.indexToOpen ? -1 : index);
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
