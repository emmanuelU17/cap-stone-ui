import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryResponse, CollectionResponse, ImageFilter, SizeInventory} from "../../shared-util";
import {Observable, tap} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
    SizeInventoryComponent,
    DirectiveModule
  ],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent implements OnInit {
  private service: NewProductService = inject(NewProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);
  private productService: ProductService = inject(ProductService);

  categories$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  config = {};
  content: string = '';
  imageUrls: ImageFilter[] = [];
  files: File[] = []; // Images
  inputRows: SizeInventory[] = [];

  reactiveForm: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    collection: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    price: new FormControl('', Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(400)]),
    currency: new FormControl("USD"),
    files: new FormControl(null, Validators.required),
    visible: new FormControl(false, Validators.required),
    colour: new FormControl('', Validators.required),
    sizeInventory: new FormControl(null, Validators.required)
  });

  /** Load CKEditor toolbar config */
  ngOnInit(): void {
    // https://stackoverflow.com/questions/13499025/how-to-show-ckeditor-with-basic-toolbar
    this.config = {
      toolbar: [
        ['Format', 'Font', 'FontSize'],
        ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
        ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table', '-', 'Link']
      ],
      height: '80px'
    };
  }

  /**
   * Responsible for verifying file uploaded is in image and then updating file FormGroup.
   * For better understanding https://blog.angular-university.io/angular-file-upload/
   * @param event of any
   * @return void
   * */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.reactiveForm.controls['files'].setValue(file);
      this.imageUrls.push({url: URL.createObjectURL(file), name: file.name});
      this.files.push(file);
    }
  }

  /** Clears reactiveForm */
  clear(): void {
    this.imageUrls = [];
    this.service.setImageUrl([])
    this.files = [];
    this.reactiveForm.reset();
  }

  // TODO
  /**
   * Removes image clicked
   * @param url is image name transformed into a url from method above *onFileSelected*
   * @return void
   * */
  remove(url: ImageFilter): void {
    // Get index in File array based on url
    const fileIndex: number = this.files.findIndex((file: File): boolean => file.name === url.name);
    // Get index in image url array based on url
    const urlIndex: number = this.imageUrls.findIndex((img: ImageFilter): boolean => img.url === url.url);
    // Delete if present
    if (fileIndex !== -1 && urlIndex !== -1) {
      // this.files.slice(fileIndex, 1);
      // this.imageUrls.slice(urlIndex, 1);
    }
  }

  /** Sets Size and Inventory to FormGroup */
  sizeInv(arr: SizeInventory[]): void {
    this.inputRows = arr;
    this.reactiveForm.controls['sizeInventory'].setValue(arr);
  }

  /**
   * Method responsible for creating a new product
   * @return void
   * */
  submit(): Observable<number> {
    return this.service.create(this.toFormData(this.reactiveForm)).pipe(
      tap((status: number): void => {
        if (status >= 200 && status < 300) {
          this.clear();
          this.reactiveForm.controls['collection'].setValue('');
          this.reactiveForm.controls['category'].setValue('');
          // Refresh products$ on successful upload
          this.productService._products$ = this.productService.fetchAllProducts();
          // TODO clear sizeInventory
        }
      }),
    );
  }

  /** Responsible for converting from FormGroup to FormData */
  private toFormData(formGroup: FormGroup): FormData {
    this.reactiveForm.controls['sizeInventory'].setValue(null);
    this.reactiveForm.controls['files'].setValue(null);
    const formData: FormData = new FormData();
    for (const key in formGroup.controls) {
      if (key !== 'files' && key !== 'sizeInventory') {
        formData.append(key, formGroup.controls[key].value);
      }
    }
    this.files.forEach((file: File) => formData.append('files', file));
    this.inputRows.forEach((row: SizeInventory) => formData.append('sizeInventory', JSON.stringify(row)));
    return formData;
  }
}
