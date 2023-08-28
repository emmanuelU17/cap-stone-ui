import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCategoryService} from "./new-category.service";
import {Observable, tap} from "rxjs";
import {CategoryRequest} from "../../shared-util";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCategoryComponent {
  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(80)]),
    parent: new FormControl(''),
    visible: new FormControl(false, Validators.required)
  });

  constructor(private service: NewCategoryService) { }

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.reset();
  }

  /** Submit reactive form to our server */
  submit(): Observable<number> {
    const obj: CategoryRequest = {
      name: this.reactiveForm.get('name')?.value,
      parent: this.reactiveForm.get('parent')?.value,
      visible: this.reactiveForm.get('visible')?.value
    };

    return this.service.create(obj).pipe(
      tap((res: number): void => {
        if (res >= 200 && res < 300) {
          this.clear();
        }
      })
    );
  }
}
