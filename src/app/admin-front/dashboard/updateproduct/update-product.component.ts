import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {catchError, map, Observable, of, ReplaySubject, startWith, switchMap} from "rxjs";
import {
  CategoryResponse,
  CKEDITOR4CONFIG,
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
import {CustomUpdateVariant} from "../updatevariant/updateVariant";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {UpdateVariantComponent} from "../updatevariant/update-variant.component";

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    DirectiveModule,
    DynamicTableComponent,
    MatDialogModule
  ],
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
  private dialog: MatDialog = inject(MatDialog);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';

  // Custom object
  private product: ProductResponse | undefined = this.productService.products
    .find((value: ProductResponse) => value.id === this.uuid)

  data: { categoryId?: string, collectionId?: string, product?: ProductResponse } = {
    categoryId: this.categoryService.categories
      .find(c => c.category === this.product?.category)?.id,
    collectionId: this.collectionService.collections
      .find(c => c.collection === this.product?.collection)?.id,
    product: this.product
  }

  // Categories and Collections
  categories$: Observable<CategoryResponse[]> = this.categoryService._categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  // Table
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
            this.productSubject$.next(obj);
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
  private productSubject$ = new ReplaySubject<CustomRowMapper>();
  currentProduct$ = this.productSubject$.asObservable();

  // CKEditor
  config = CKEDITOR4CONFIG;

  // FormGroup
  form = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    price: new FormControl(0, Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(400)]),
  });

  ngOnInit(): void {
    if (!this.data.product) {
      return;
    }

    this.form.controls['name'].setValue(this.data.product.name);
    this.form.controls['price'].setValue(this.data.product.price);
    this.form.controls['desc'].setValue(this.data.product.desc);
  }

  /** Return back to product component */
  returnToProductComponent(): void {
    this.navigationService.navigateBack('/admin/dashboard/product');
  }

  /** Updates data on change of category */
  onChangeCategory(category: string): void {
    if (!this.data.product) {
      return;
    }

    this.data.product.category = category;
    const cat: CategoryResponse | undefined = this.categoryService.categories
      .find(c => c.category === category);

    if (cat) {
      this.data.categoryId = cat.id
    }

  }

  /** Updates data on change of collection */
  onChangeCollection(collection: string): void {
    if (!this.data.product) {
      return;
    }

    this.data.product.collection = collection;
    const col: CollectionResponse | undefined = this.collectionService.collections
      .find(c => c.collection === collection);

    if (col) {
      this.data.collectionId = col.id
    }

  }

  /** Makes call to server to update product not product detail */
  onSubmit(): Observable<number> {
    // Reactive form
    const name = this.form.controls['name'].value;
    const price = this.form.controls['price'].value;
    const desc = this.form.controls['desc'].value;

    // Data
    const product = this.data.product;
    const cat = this.data.categoryId;
    const col = this.data.collectionId;

    // Validation
    if (!name || !price || !desc || !product || !cat || !col) {
      // TODO display error via toast
      return of();
    }

    // Create payload
    const json: UpdateProduct = {
      category_id: cat,
      collection_id: col,
      id: this.uuid,
      name: name,
      price: price,
      desc: desc,
      category: product.category,
      collection: product.collection
    };

    // Make call to server
    return this.updateProduct(json);
  }

  /** Makes a call to our server to update a Product */
  private updateProduct(obj: UpdateProduct): Observable<number> {
    return this.productService.updateProduct(obj).pipe(
      switchMap((status: number) => {
        const res = of(status);

        // Error
        if (!(status >= 200 && status < 300)) {
          return res;
        }

        return this.productService.fetchAllProducts().pipe(switchMap(() => res));
      })
    );
  }

  /**
   * Based on info key received from Dynamic table Component,
   * we either do nothing, update or delete action
   * @param content is info received from Dynamic Table Component
   * */
  onDeleteOrUpdateVariant(content: TableContent<CustomRowMapper>): void {
    this.form.controls['sku'].setValue(content.data.sku);
    this.productSubject$.next(content.data);

    switch (content.key) {
      case 'view':
        console.log('Do nothing')
        break;
      case 'edit':
        const v: CustomUpdateVariant = {
          productId: this.uuid,
          variant: {
            sku: content.data.sku,
            is_visible: content.data.is_visible,
            qty: content.data.inventory,
            size: content.data.size
          }
        }
        this.dialog.open(UpdateVariantComponent, {
          data: v,
        })
        break;
      case 'delete':
        break;
      default:
        console.error('Invalid key');
    }
  }

}
