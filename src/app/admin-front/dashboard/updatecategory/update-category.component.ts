import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, ProductResponse} from "../../shared-util";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {DirectiveModule} from "../../../directive/directive.module";
import {UpdateCategoryService} from "./update-category.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Page} from "../../../global-utils";
import {CategoryService} from "../category/category.service";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../service/navigation.service";

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    DynamicTableComponent,
    MatButtonModule,
    DirectiveModule
  ],
  templateUrl: './update-category.component.html',
})
export class UpdateCategoryComponent implements OnInit {
  private service: UpdateCategoryService = inject(UpdateCategoryService);
  private categoryService: CategoryService = inject(CategoryService);
  private navigationService: NavigationService = inject(NavigationService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';

  data: CategoryResponse | undefined = this.categoryService.categories
    .find(c => c.id === this.uuid);

  // Table
  thead: Array<keyof ProductResponse> = ['image', 'id', 'name', 'desc', 'currency', 'price'];
  data$: Observable<{
    state: string,
    error?: string,
    data?: Page<ProductResponse>
  }> = this.service.allProductByCategory(this.uuid).pipe(
    map((arr: Page<ProductResponse>) => ({state: 'LOADED', data: arr})),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
  );

  reactiveForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.reactiveForm.controls['name'].setValue(this.data.category);
      this.reactiveForm.controls['visible'].setValue(this.data.visible);
    }
  }

  /** Return back to parent */
  returnToCategoryComponent(): void {
    this.navigationService.navigateBack('/admin/dashboard/category');
  }

  /** Clear input field */
  clear(): void {
    this.reactiveForm.reset();
    this.returnToCategoryComponent();
  }

  /** Updates category */
  update(): Observable<number> {
    const name = this.reactiveForm.controls['name'].value;
    const visible = this.reactiveForm.controls['visible'].value;

    if (!name || visible === null) {
      return of(0);
    }

    return this.service
      .updateCategory({id: this.uuid, name: name, visible: visible})
      .pipe(
        switchMap((status: number): Observable<number> => {
          const res = of(status);

          // Return status code is response is an error
          if (!(status >= 200 && status < 300)) {
            return res;
          }

          // Update CategoryResponse array
          return this.categoryService.fetchCategories().pipe(switchMap(() => res));
        })
      );
  }

}
