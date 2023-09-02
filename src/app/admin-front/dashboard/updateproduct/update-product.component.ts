import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, catchError, map, Observable, of, ReplaySubject, startWith, Subject, tap} from "rxjs";
import {
  CategoryResponse,
  CollectionResponse,
  CustomRowMapper,
  ProductDetailResponse,
  TableContent,
  UpdateProduct,
  Variant
} from "../../shared-util";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductService} from "../product/product.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CKEditorModule} from "ckeditor4-angular";
import {DirectiveModule} from "../../../directive/directive.module";
import {CategoryService} from "../category/category.service";
import {CollectionService} from "../collection/collection.service";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule, DirectiveModule, DynamicTableComponent],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateProductComponent implements OnInit {
// TODO make number input box more stylish

  private productService: ProductService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);

  @Input() id: string = '';
  @Input() name: string = '';
  @Input() desc: string = '';
  @Input() price: number = 0;
  @Input() category: string = '';
  @Input() collection: string = '';
  @Output() parentEmitter = new EventEmitter<boolean>();
  @Output() refreshEmitter = new EventEmitter<boolean>();

  categories$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  private prodId: string = this.productService.getProductID();

  productVariants$: Observable<{
    state: string,
    error?: string,
    data?: CustomRowMapper[]
  }> = this.productService.fetchProductDetails(this.prodId).pipe(
    map((arr: ProductDetailResponse[]) => {
      // Set SKU to the first Item on load of page

      // this.currDetail = arr[0];
      // this.form.controls['sku'].setValue(arr[0].sku);

      // Flatmap to convert from CustomRowMapper[][] to CustomRowMapper[]
      const mappers: CustomRowMapper[] = arr.flatMap((res: ProductDetailResponse) => {
        const data: CustomRowMapper[] = [];

        // Based on the amount of Variants, append to CustomMapper
        res.variants.forEach((variant: Variant, index: number): void => {
          const obj: CustomRowMapper = {
            url: res.url[0],
            urls: res.url,
            colour: res.colour,
            is_visible: res.is_visible,
            sku: variant.sku,
            inventory: Number(variant.inventory),
            size: variant.size,
            action: ''
          }
          data.push(obj);
          if (index === 0) {
            this.subjectMapper$.next(obj);
            this.form.controls['sku'].setValue(variant.sku);
          }
        });

        return data;
      })

      return {state: 'LOADED', data: mappers};
    }),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error}))
  );

  // Initially the product variant displayed and when user clicks on variant table
  private subjectMapper$ = new ReplaySubject<CustomRowMapper>();
  firstRowMapper$ = this.subjectMapper$.asObservable();

  thead: Array<keyof CustomRowMapper> = ['url', 'colour', 'is_visible', 'sku', 'inventory', 'size', 'action'];

  // CKEditor
  config = {};

  // FormGroup
  form = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl(this.name, [Validators.required, Validators.max(50)]),
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    price: new FormControl(this.price, Validators.required),
    desc: new FormControl(this.desc, [Validators.required, Validators.max(400)]),
    category: new FormControl('', [Validators.required]),
    collection: new FormControl(''),
  });

  ngOnInit(): void {
    this.config = {
      toolbar: [
        ['Format', 'Font', 'FontSize'],
        ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
        ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table', '-', 'Link']
      ],
      height: '80px'
    };

    this.form.controls['id'].setValue(this.prodId);
    this.form.controls['name'].setValue(this.name);
    this.form.controls['price'].setValue(this.price);
    this.form.controls['desc'].setValue(this.desc);
    this.form.controls['category'].setValue(this.category);

    // possibly null
    const col: string = !this.collection ? '' : this.collection;
    this.form.controls['collection'].setValue(col);
  }

  /** Return back to product component */
  returnBack(): void {
    this.parentEmitter.emit(true);
  }

  /** Makes call to server to update product not product detail */
  onSubmit(): Observable<number> {
    const name = this.form.get('name')?.value;
    const price = this.form.get('price')?.value;
    const desc = this.form.get('desc')?.value;
    const category = this.form.get('category')?.value;
    const collection = this.form.get('collection')?.value;

    if (!name || !price || !desc || !category) {
      // TODO display error via toast
      return of();
    }

    const json: UpdateProduct = {
      id: this.prodId,
      name: name,
      price: price,
      desc: desc,
      category: category,
      collection: !collection ? '' : collection
    };

    return this.updateProduct(json);
  }

  /** Makes a call to our server to update a Product */
  private updateProduct(obj: UpdateProduct): Observable<number> {
    return this.productService.updateProduct(obj).pipe(
      tap((res: number): void => {
        if (res >= 200 && res < 300) {
          // this.toastService.createToast('successfully updated ' + obj.name);
          this.refreshEmitter.emit(true);
        }
      }));
  }

  /** Updates or deletes a product detail based on info received from UpdateProductComponent */
  onDeleteOrUpdateClick(tableContent: TableContent<CustomRowMapper>): void {
    this.form.controls['sku'].setValue(tableContent.data.sku);
    this.subjectMapper$.next(tableContent.data);
  }

}
