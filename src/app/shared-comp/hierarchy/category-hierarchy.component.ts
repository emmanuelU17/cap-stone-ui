import {ChangeDetectionStrategy, Component, Input, OnInit, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Category} from "../../global-utils";

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .fnt {
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .fnt {
        font-size: calc(12px + 1vw);
      }
    }
  `],
  template: `
    @for (category of categoriesSignal(); track category.category_id; let i = $index) {
      <div class="w-full">
        <div class="flex justify-between">
          <button type="button" class="uppercase text-xs">
            <h1 class="fnt uppercase">{{ category.name }}</h1>
          </button>

          @if (category.children && category.children.length > 0) {
            <button type="button" (click)="toggleBtn(i)" class="fnt">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <!-- plus icon -->
                <path *ngIf="category.toggle" stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                <!-- minus icon -->
                <path *ngIf="!category.toggle" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </button>
          }
        </div>

        @if (!category.toggle) {
          <div class="pl-2">
            <app-hierarchy [categories]="category.children"></app-hierarchy>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryHierarchyComponent implements OnInit {

  @Input() categories: Category[] = [];

  readonly categoriesSignal = signal<ToggleCategory[]>([])

  ngOnInit(): void {
    this.categoriesSignal.set(this.mapper(this.categories));
  }

  mapper(children: Category[]): ToggleCategory[] {
    return (!children || children.length < 1)
      ? []
      : children.map(c =>
        ({
          name: c.name,
          category_id: c.category_id,
          parent_id: c.parent_id,
          visible: c.visible,
          children: this.mapper(c.children),
          toggle: true
        }));
  }

  toggleBtn(index: number): void {
    this.categoriesSignal()[index].toggle = !this.categoriesSignal()[index].toggle;
  }

}

interface ToggleCategory {
  name: string;
  category_id: number;
  parent_id: number;
  visible: boolean;
  children: ToggleCategory[];
  toggle: boolean;
}
