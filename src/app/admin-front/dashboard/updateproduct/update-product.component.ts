import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {catchError, map, Observable, of, ReplaySubject, startWith, switchMap} from "rxjs";
import {
  CategoryResponse,
  CollectionResponse,
  CustomRowMapper,
  ProductDetailResponse,
  ProductResponse,
  TableContent,
  UpdateProduct,
} from "../../shared-util";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductService} from "../product/product.service";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CKEditorModule} from "ckeditor4-angular";
import {DirectiveModule} from "../../../directive/directive.module";
import {CategoryService} from "../category/category.service";
import {CollectionService} from "../collection/collection.service";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {Variant} from "../../../global-utils";
import {NavigationService} from "../../../service/navigation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule, DirectiveModule, DynamicTableComponent],
  templateUrl: './update-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateProductComponent implements OnInit {
  private navigationService: NavigationService = inject(NavigationService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private productService: ProductService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private collectionService: CollectionService = inject(CollectionService);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';

  // Product
  data: ProductResponse | undefined = this.productService.products
    .find(p => p.id === this.uuid);

  // Categories and Collections
  categories$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  // Retrieve variants on load of application
  thead: Array<keyof CustomRowMapper> = ['url', 'colour', 'is_visible', 'sku', 'inventory', 'size', 'action'];
  productVariants$: Observable<{
    state: string,
    error?: string,
    data?: CustomRowMapper[]
  }> = this.productService.fetchProductDetails(this.uuid).pipe(
    map((arr: ProductDetailResponse[]) => {
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

      return { state: 'LOADED', data: mappers };
    }),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error }))
  );

  // Initially the product variant displayed and when user clicks on variant table
  private subjectMapper$ = new ReplaySubject<CustomRowMapper>();
  firstRowMapper$ = this.subjectMapper$.asObservable();

  // CKEditor
  config = {};

  // FormGroup
  form = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    price: new FormControl(0, Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(400)]),
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

    if (!this.data) {
      return;
    }

    this.form.controls['name'].setValue(this.data.name);
    this.form.controls['price'].setValue(this.data.price);
    this.form.controls['desc'].setValue(this.data.desc);
    this.form.controls['category'].setValue(this.data.category);

    // possibly null
    const col: string = !this.data.collection ? '' : this.data.collection;
    this.form.controls['collection'].setValue(col);
  }

  /** Return back to product component */
  returnToProductComponent(): void {
    this.navigationService.navigateBack('/admin/dashboard/product');
  }

  /** Makes call to server to update product not product detail */
  onSubmit(): Observable<number> {
    const name = this.form.controls['name'].value;
    const price = this.form.controls['price'].value;
    const desc = this.form.controls['desc'].value;
    const category = this.form.controls['category'].value;
    const collection = this.form.controls['collection'].value;

    if (!name || !price || !desc || !category) {
      // TODO display error via toast
      return of();
    }

    const json: UpdateProduct = {
      id: this.uuid,
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
      switchMap((status: number) => {
        const res = of(status);

        // Return status code is response is an error
        if (!(status >= 200 && status < 300)) {
          return res;
        }

        return this.productService.fetchAllProducts().pipe(switchMap(() => res));
      })
    );
  }

  /** Updates or deletes a product detail based on info received from UpdateProductComponent */
  onDeleteOrUpdateVariant(tableContent: TableContent<CustomRowMapper>): void {
    this.form.controls['sku'].setValue(tableContent.data.sku);
    this.subjectMapper$.next(tableContent.data);
  }

}
