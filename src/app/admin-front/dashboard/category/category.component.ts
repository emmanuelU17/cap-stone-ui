import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, TableContent} from "../../shared-util";
import {CategoryService} from "./category.service";
import {Observable} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {UpdateCategoryComponent} from "../updatecategory/update-category.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, UpdateCategoryComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private categoryService: CategoryService = inject(CategoryService);
  data?: CategoryResponse; // data passed to UpdateCategoryComponent

  data$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  tHead: Array<keyof CategoryResponse> = ['id', 'category', 'created_at', 'modified_at', 'visible', 'action'];

  categoryComponent = true;

  childEmitter(bool: boolean): void {
    this.categoryComponent = bool;
  }

  infoFromTableComponent(content: TableContent<CategoryResponse>): void {
    switch (content.key) {
      case 'edit':
        this.categoryComponent = false;
        this.data = content.data;
        break;
      case 'delete':
        // TODO
        break;
      default :
        console.error('Invalid key chosen');
    }
  }

}
