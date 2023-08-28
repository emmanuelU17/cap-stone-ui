import {ChangeDetectionStrategy, Component} from '@angular/core';
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
  tHead: Array<keyof CategoryResponse> = ['id', 'category', 'created_at', 'modified_at', 'visible', 'action'];

  data$: Observable<CategoryResponse[]>;

  constructor(public categoryService: CategoryService) {
    this.data$ = this.categoryService._categories$;
  }

  infoFromTableComponent(content: TableContent<CategoryResponse>): void {
    console.log('Content ', content);
  }

}
