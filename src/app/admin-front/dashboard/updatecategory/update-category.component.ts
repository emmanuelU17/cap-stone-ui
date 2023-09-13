import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, ProductResponse} from "../../shared-util";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {DirectiveModule} from "../../../directive/directive.module";
import {UpdateCategoryService} from "./update-category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Page} from "../../../global-utils";

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, ReactiveFormsModule, DynamicTableComponent, MatButtonModule, DirectiveModule],
  templateUrl: './update-category.component.html',
})
export class UpdateCategoryComponent implements OnInit {
  private service: UpdateCategoryService = inject(UpdateCategoryService);
  private fb: FormBuilder = inject(FormBuilder);

  thead: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price'];
  data$?: Observable<{ state: string, error?: string, data?: Page<ProductResponse> }>;

  @Input() data!: CategoryResponse;
  @Output() emitter = new EventEmitter<boolean>();

  reactiveForm = this.fb.group({
    id: new FormControl({ value: '', disabled: true }, Validators.required),
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {
    const id = this.data.id;
    this.data$ = this.service.allProductByCategory(id).pipe(
      map((arr: Page<ProductResponse>) => ({ state: 'LOADED', data: arr })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error.message }))
    );

    this.reactiveForm.controls['id'].setValue(id);
    this.reactiveForm.controls['name'].setValue(this.data.category);
    this.reactiveForm.controls['visible'].setValue(this.data.visible);
  }

  /** Return back to parent */
  returnToCategoryComponent(): void {
    this.emitter.emit(true);
  }

  /***/
  clear(): void {
    this.reactiveForm.reset();
    this.returnToCategoryComponent();
  }

  /***/
  update(): Observable<number> {
    return of(200);
  }

}
