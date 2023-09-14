import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, TableContent} from "../../shared-util";
import {CategoryService} from "./category.service";
import {Observable} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private categoryService: CategoryService = inject(CategoryService);
  private router: Router = inject(Router);

  data$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  tHead: Array<keyof CategoryResponse> = ['id', 'category', 'created_at', 'modified_at', 'visible', 'action'];

  infoFromTableComponent(content: TableContent<CategoryResponse>): void {
    switch (content.key) {
      case 'edit':
        this.router.navigate([`/admin/dashboard/category/${content.data.id}`]);
        break;
      case 'delete':
        // TODO
        break;
      default :
        console.error('Invalid key chosen');
    }
  }

}
