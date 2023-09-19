import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCategoryService} from "./new-category.service";
import {catchError, Observable, of, switchMap} from "rxjs";
import {CategoryRequest} from "../../shared-util";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";
import {CategoryService} from "../category/category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../service/toast/toast.service";

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCategoryComponent {
  private readonly newCategoryService: NewCategoryService = inject(NewCategoryService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly toastService: ToastService = inject(ToastService);

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
      name: this.reactiveForm.controls['name'].value,
      parent: this.reactiveForm.controls['parent'].value,
      visible: this.reactiveForm.controls['visible'].value
    };

    return this.newCategoryService.create(obj).pipe(
      switchMap((status: number): Observable<number> => {
        // Clear Input field
        this.clear();
        this.reactiveForm.controls['parent'].setValue('');

        // Make call to server to update CategoryResponse[]
        return this.categoryService.fetchCategories().pipe(switchMap(() => of(status)));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

}
