import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="text-black" aria-label="pagination">
      <ul class="list-style-none flex justify-center">
        <!-- Previous -->
        <li class="cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:rounded-full">
          <a
            class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300"
            aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <li class="flex cursor-pointer">
          <a
            *ngFor="let num of range(); let i = index"
            class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-gray-200 hover:rounded-full"
          >{{ num + 1 }}</a>
        </li>

        <!-- dot dot -->
        <li class="cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:rounded-full">
          <a
            class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300"
          >...</a
          >
        </li>

        <!-- last page -->
        <li class="cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:rounded-full">
          <a
            class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300"
          >{{ totalPages }}</a>
        </li>

        <!-- Next -->
        <li class="cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:rounded-full">
          <a
            class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600"
            aria-label="Next"
          ><span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {

  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() limit: number = 20;

  @Output() goTo= new EventEmitter<number>();
  @Output() next= new EventEmitter<number>();
  @Output() previous= new EventEmitter<number>();

  ngOnInit(): void {
    const pagesCount = Math.ceil(this.totalElements / this.limit);
  }

  range(): number[] {
    return [...Array(this.totalPages).keys()];
  }

  /**
   * Displays page based on number clicked
   * */
  onGoTo(page: number): void {
    this.goTo.emit(page)
  }

  /**
   * Displays next page
   * */
  onNext(): void {
    this.next.emit(this.currentPage)
  }

  /**
   * Displays previous page
   * */
  onPrevious(): void {
    this.previous.next(this.currentPage)
  }

}
