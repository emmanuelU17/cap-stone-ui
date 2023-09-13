import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, TableContent} from "../../shared-util";
import {CategoryService} from "./category.service";
import {Observable} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private categoryService: CategoryService = inject(CategoryService);

  data$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  tHead: Array<keyof CategoryResponse> = ['id', 'category', 'created_at', 'modified_at', 'visible', 'action'];

  infoFromTableComponent(content: TableContent<CategoryResponse>): void {
    console.log('Content ', content);
  }

}
