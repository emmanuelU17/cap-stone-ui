import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCategoryService} from "./new-category.service";
import {map, Observable, of, switchMap} from "rxjs";
import {CategoryRequest, CategoryResponse} from "../../shared-util";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";
import {CategoryService} from "../category/category.service";

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCategoryComponent {

  private newCategoryService: NewCategoryService = inject(NewCategoryService);
  private categoryService: CategoryService = inject(CategoryService);

  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(80)]),
    parent: new FormControl(''),
    visible: new FormControl(false, Validators.required)
  });

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.reset();
  }

  /**
   * Submit reactive form to our server.
   * The gotcha is on successful creation, we switch map to update categories array
   * @return Observable of type number
   * */
  submit(): Observable<number> {
    const obj: CategoryRequest = {
      name: this.reactiveForm.get('name')?.value,
      parent: this.reactiveForm.get('parent')?.value,
      visible: this.reactiveForm.get('visible')?.value
    };

    return this.newCategoryService.create(obj).pipe(
      switchMap((num: number): Observable<number> => {
        if (num >= 200 && num < 300) {
          this.clear();
          // Make call to server to update CategoryResponse[]
          return this.categoryService.fetchCategories().pipe(
            map((arr: CategoryResponse[]) => {
              this.categoryService.setCategories(arr);
              return num;
            }),
          );
        }
        return of(num);
      })
    );
  }

}
