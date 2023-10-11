import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, CKEDITOR4CONFIG, CollectionResponse, SizeInventory} from "../../shared-util";
import {catchError, Observable, of, switchMap} from "rxjs";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoryService} from "../category/category.service";
import {CollectionService} from "../collection/collection.service";
import {NewProductService} from "./new-product.service";
import {SizeInventoryComponent} from "../sizeinventory/size-inventory.component";
import {CKEditorModule} from "ckeditor4-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {DirectiveModule} from "../../../directive/directive.module";
import {ProductService} from "../product/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../service/toast/toast.service";
import {SizeInventoryService} from "../sizeinventory/size-inventory.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    SizeInventoryComponent,
    CKEditorModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    DirectiveModule
  ],
  templateUrl: './new-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent {

  private readonly newProductService: NewProductService = inject(NewProductService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly collectionService: CollectionService = inject(CollectionService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly sizeInventoryService: SizeInventoryService = inject(SizeInventoryService);
  private readonly router: Router = inject(Router);

  // Converts from file to string
  toString = (file: File): string => URL.createObjectURL(file);

  config = CKEDITOR4CONFIG;
  content: string = '';
  files: File[] = []; // Images
  rows: SizeInventory[] = [];

  categories$: Observable<CategoryResponse[]> = this.categoryService.categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  form = this.fb.group({
    category: new FormControl('', [Validators.required]),
    collection: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    price: new FormControl('', Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(400)]),
    currency: new FormControl('NGN'),
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
    const file: File = event.target.files[0];
    if (file) {
      this.files.push(file);
    }
  }

  /** Clears reactiveForm */
  clear(): void {
    Object.keys(this.form.controls).forEach(key => {
      let value: string | boolean = '';
      if (key === 'currency') {
        value = 'NGN';
      } else if (key === 'visible') {
        value = false;
      }
      this.form.get(key)?.reset(value);
    });
    this.files = [];
    this.sizeInventoryService.setSubject(true);

  }

  /**
   * Removes image clicked
   *
   * @param file
   * @return void
   * */
  remove(file: File): void {
    const index: number = this.files.findIndex((value: File) => value.name === file.name);
    this.files.splice(index, 1);
  }

  /** Sets Size and Inventory to FormGroup */
  sizeInv(arr: SizeInventory[]): void {
    this.rows = arr;
  }

  /**
   * Method responsible for creating a new product
   *
   * @return void
   * */
  submit(): Observable<number> {
    const formData: FormData = new FormData();

    const dto = {
      category: this.form.controls['category'].value,
      collection: this.form.controls['collection'].value,
      name: this.form.controls['name'].value,
      price: this.form.controls['price'].value,
      desc: this.form.controls['desc'].value,
      currency: this.form.controls['currency'].value,
      visible: this.form.controls['visible'].value,
      colour: this.form.controls['colour'].value,
      sizeInventory: this.rows,
    }

    const blob = new Blob([JSON.stringify(dto)], {
      type: 'application/json'
    });
    formData.append('dto', blob);

    // append files
    this.files.forEach((file: File) => formData.append('files', file));

    return this.create(formData);
  }

  /** Creates a new Product and fetches new products to updates product table */
  private create(data: FormData): Observable<number> {
    return this.newProductService.create(data).pipe(
      switchMap((status: number) => {
        this.sizeInventoryService.setSubject(true);
        this.clear();

        return this.productService
          .fetchAllProducts()
          .pipe(switchMap(() => of(status)));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

}
