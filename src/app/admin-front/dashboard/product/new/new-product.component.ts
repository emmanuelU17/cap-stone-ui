import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SizeInventory} from "../../../shared-util";
import {catchError, Observable, of, switchMap} from "rxjs";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoryService} from "../../category/category.service";
import {NewProductService} from "./new-product.service";
import {SizeInventoryComponent} from "../sizeinventory/size-inventory.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../../directive/directive.module";
import {ProductService} from "../product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../../shared-comp/toast/toast.service";
import {SizeInventoryService} from "../sizeinventory/size-inventory.service";
import {Router} from "@angular/router";
import {SarreCurrency} from "../../../../global-utils";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CategoryHierarchyComponent} from "../../../../shared-comp/hierarchy/category-hierarchy.component";

@Component({
  selector: 'app-new-product',
  standalone: true,
  styles: [`
    :host ::ng-deep .ck-editor__editable_inline {
      min-height: 100px;
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SizeInventoryComponent,
    CKEditorModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    DirectiveModule,
    CategoryHierarchyComponent
  ],
  templateUrl: './new-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent {

  private readonly newProductService = inject(NewProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly sizeInventoryService = inject(SizeInventoryService);
  private readonly router = inject(Router);

  // converts from file to string
  toString = (file: File): string => URL.createObjectURL(file);

  config = ClassicEditor;
  content: string = '';
  files: File[] = []; // Images
  rows: SizeInventory[] = [];

  toggle = true;
  readonly hierarchy$ = this.categoryService.hierarchy$;

  readonly form = this.fb.group({
    collection: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    weight: new FormControl('', Validators.required),
    ngn: new FormControl('', Validators.required),
    usd: new FormControl('', Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(1000)]),
    visible: new FormControl(false, Validators.required),
    colour: new FormControl('', Validators.required),
  });

  routeToProductComponent = (): void => {
    this.router.navigate(['/admin/dashboard/product']);
  }

  /**
   * Responsible for verifying file uploaded is in image and then updating file FormGroup.
   * For better understanding https://blog.angular-university.io/angular-file-upload/
   *
   * @param event of any
   * @return void
   * */
  onFileSelected(event: any): void {
    for (let i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];
      this.files.push(file);
    }
  }

  /**
   * Clears reactiveForm
   * */
  clear(): void {
    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'visible') {
        this.form.get(key)?.reset('');
      }
    });
    this.files = [];
    this.sizeInventoryService.setSubject(true);
    this.currentCategory = undefined;
  }

  /**
   * Removes image clicked
   *
   * @param file
   * @return void
   * */
  remove(file: File): void {
    const index: number = this.files
      .findIndex((value: File) => value.name === file.name);
    this.files.splice(index, 1);
  }

  /**
   * Updates SizeInventory[]
   * */
  sizeInv(arr: SizeInventory[]): void {
    this.rows = arr;
  }

  currentCategory: { categoryId: number; name: string } | undefined = undefined;
  categoryClicked(obj: { categoryId: number; name: string }): void {
    this.currentCategory = obj;
  }

  /**
   * Method responsible for creating a new product
   *
   * @return void
   * */
  submit(): Observable<number> {
    if (!this.currentCategory) {
      return of(0);
    }

    const formData = new FormData();

    const dto = {
      category_id: this.currentCategory.categoryId,
      name: this.form.controls['name'].value,
      priceCurrency: [
        { currency: SarreCurrency.NGN, price: this.form.controls['ngn'].value },
        { currency: SarreCurrency.USD , price: this.form.controls['usd'].value }
      ],
      weight: this.form.controls['weight'].value,
      desc: this.form.controls['desc'].value?.trim(),
      visible: this.form.controls['visible'].value,
      colour: this.form.controls['colour'].value,
      sizeInventory: this.rows,
    }

    formData
      .append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    // append files
    this.files.forEach((file: File) => formData.append('files', file));

    return this.create(formData);
  }

  /**
   * Creates a new Product and fetches new products to updates product table
   * */
  private create(data: FormData): Observable<number> {
    return this.newProductService.create(data)
      .pipe(
        switchMap((status: number) => {
          this.sizeInventoryService.setSubject(true);
          this.clear();
          return this.productService.currency$
            .pipe(
              switchMap((currency) => this.productService
                .allProducts(0, 20, currency)
                .pipe(switchMap(() => of(status)))
              )
            );
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error ? err.error.message : err.message);
          return of(err.status);
        })
      );
  }

}
