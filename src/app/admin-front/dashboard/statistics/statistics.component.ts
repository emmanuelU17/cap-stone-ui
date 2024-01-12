import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CategoryService} from "../category/category.service";
import {CategoryHierarchyComponent} from "../../../shared-comp/hierarchy/category-hierarchy.component";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, CategoryHierarchyComponent],
  template: `
    <div class="h-full">
      @if (hierarchy$ | async; as hierarchy) {
        <div class="w-fit p-2 flex gap-2 flex-col border-black border">
          <app-hierarchy [categories]="hierarchy"></app-hierarchy>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {

  private readonly service = inject(CategoryService);

  readonly hierarchy$ = this.service.hierarchy$;

}
