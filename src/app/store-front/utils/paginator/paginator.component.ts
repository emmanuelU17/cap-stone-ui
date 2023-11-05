import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, RouterLinkActive],
  template: `
    <nav class="text-black" aria-label="pagination">

      <ng-container *ngIf="totalPages < 6; else greater">
        <ul class="list-style-none flex justify-center">
          <li class="flex gap-2 cursor-pointer">
            <!-- rgb(148 163 184) -->
            <a
              *ngFor="let num of range(); let i = index"
              (click)="onGoTo(num)"
              [attr.data-page-number]="num"
              aria-label="button number"
              [style]="{ 'background-color': num === currentPage ? 'var(--app-theme)' : '' }"
              class="relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-gray-200"
            >{{ num + 1 }}</a>
          </li>
        </ul>
      </ng-container>

      <ng-template #greater>
        <ul class="flex gap-2.5 justify-center list-style-none">
          <!-- Previous -->
          <li>
            <a (click)="onPrevious()"
              aria-label="Previous button"
              class="relative cursor-pointer block rounded-full bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-gray-200"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <!-- number -->
          <li class="slider w-60 flex overflow-x-auto scroll-smooth">
            <a
              *ngFor="let num of range(); let i = index"
              (click)="onGoTo(num)"
              aria-label="button number"
              [attr.data-page-number]="num"
              [style]="{ 'background-color': num === currentPage ? 'var(--app-theme)' : '' }"
              class="relative cursor-pointer block rounded-full bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-gray-200"
            >{{ num + 1 }}</a>
          </li>

          <!-- Next -->
          <li>
            <a (click)="onNext()"
              class="relative cursor-pointer block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-gray-200 hover:rounded-full"
              aria-label="Next button"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </ng-template>

    </nav>
  `,
  styles: [`
    /* width */
    ::-webkit-scrollbar {
      height: 5px;
      width: 5px;
      margin-top: 10px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #bec4c4;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {

  private readonly render = inject(Renderer2);

  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;

  @Output() goTo = new EventEmitter<number>();

  range(): number[] {
    return [...Array(this.totalPages).keys()];
  }

  /**
   * Informs parent component on what page number was clicked
   * */
  onGoTo(page: number): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    this.goTo.emit(page);
  }

  /**
   * Displays previous numbers
   * */
  onPrevious(): void {
    const container = this.render.selectRootElement('.slider', true);
    let dimension = container.getBoundingClientRect();
    let width = dimension.width;
    container.scrollLeft -= width;
  }

  /**
   * Displays next numbers
   * */
  onNext(): void {
    const container = this.render.selectRootElement('.slider', true);
    let dimension = container.getBoundingClientRect();
    let width = dimension.width;
    container.scrollLeft += width;
  }

}
