import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {catchError, combineLatest, map, Observable, of, ReplaySubject, startWith, switchMap, tap} from "rxjs";
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
import {ActivatedRoute, Router} from "@angular/router";
import {CustomUpdateVariant} from "../updatevariant/update-variant";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {UpdateVariantComponent} from "../updatevariant/update-variant.component";
import {ToastService} from "../../../shared-comp/toast/toast.service";
import {CreateVariantComponent} from "../create-variant/create-variant.component";
import {UpdateProductService} from "./update-product.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DeleteComponent} from "../delete/delete.component";

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

  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly updateProductService = inject(UpdateProductService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly collectionService = inject(CollectionService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Get id from route
  private id: string | null = this.activeRoute.snapshot.paramMap.get('id');
  private uuid: string = this.id ? this.id : '';

  // Custom object
  private product: ProductResponse | undefined = this.productService.products
    .find((value: ProductResponse) => value.product_id === this.uuid)

  data: { categoryId?: string, collectionId?: string, product?: ProductResponse } = {
    categoryId: this.categoryService.categories
      .find(c => c.category === this.product?.category)?.category_id,
    collectionId: this.collectionService.collections
      .find(c => c.collection === this.product?.collection)?.collection_id,
    product: this.product
  }

  // Categories and Collections
  categories$: Observable<CategoryResponse[]> = this.categoryService.categories$;
  collections$: Observable<CollectionResponse[]> = this.collectionService._collections$;

  // Table
  thead: Array<keyof CustomRowMapper> = ['index', 'url', 'colour', 'is_visible', 'sku', 'inventory', 'size', 'action'];
  productVariants$: Observable<{
    state: string,
    error?: string,
    data?: CustomRowMapper[]
  }> = this.updateProductService
    .fetchProductDetails(this.uuid)
    .pipe(
      map((arr: ProductDetailResponse[]) => {
        const mappers: CustomRowMapper[] = this.toCustomRowMapperArray(arr)
        return { state: 'LOADED', data: mappers };
      }),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error}))
    );

  // Initially the product variant displayed and when user clicks on variant table
  private productSubject$ = new ReplaySubject<CustomRowMapper>();
  currentProduct$ = this.productSubject$.asObservable();

  // CKEditor
  config = CKEDITOR4CONFIG;

  // Needed if a cx wants to create a product variant of the same colour
  private colours: string[] = [];

  // FormGroup
  form = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    price: new FormControl(0, Validators.required),
    desc: new FormControl('', [Validators.required, Validators.max(1000)]),
  });

  ngOnInit(): void {
    if (!this.data.product) {
      return;
    }

    this.form.controls['name'].setValue(this.data.product.name);
    this.form.controls['price'].setValue(this.data.product.price);
    this.form.controls['desc'].setValue(this.data.product.desc);
  }

  /**
   * Convert from ProductDetailResponse[] to CustomRowMapper[]
   * */
  private toCustomRowMapperArray(arr: ProductDetailResponse[]): CustomRowMapper[] {
    // Flatmap to convert from CustomRowMapper[][] to CustomRowMapper[]
    return arr.flatMap((res: ProductDetailResponse) => {
      const data: CustomRowMapper[] = [];

      // add all colours
      this.colours.push(...[res.colour]);

      // Based on the amount of Variants, append to CustomMapper
      res.variants.forEach((variant: Variant, index: number): void => {
        const obj: CustomRowMapper = {
          index: index,
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
    });
  }

  private afterComponentClose<T extends { arr: ProductDetailResponse[] }>(obj: Observable<T>): void {
    obj.pipe(
      tap((arr: { arr: ProductDetailResponse[] }): void => {
        if (!arr || !(arr.arr && arr.arr.length > 0)) {
          return;
        }
        const mapper = this.toCustomRowMapperArray(arr.arr);
        this.productVariants$ = of({state: 'LOADED', data: mapper});
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /**
   * Opens CreateVariantComponent
   * */
  openCreateVariantComponent(): void {
    const open = this.dialog.open(CreateVariantComponent, {
      height: '450px',
      width: '900px',
      maxWidth: '100%',
      maxHeight: '100%',
      data: { id: this.uuid, colours: this.colours }
    });

    this.afterComponentClose(open.afterClosed());
  }

  /** Return back to product component */
  returnToProductComponent(): void {
    this.router.navigate(['/admin/dashboard/product']);
  }

  // validates if we need to refresh categories and collections array
  private onChangeCategoryOrCollection = false;

  /**
   * Updates data on change of category
   * https://angular.io/guide/user-input
   * */
  onChangeCategory(event: Event): void {
    const category: string = (event.target as HTMLInputElement).value;
    if (!this.data.product) {
      return;
    }

    this.data.product.category = category;
    const cat: CategoryResponse | undefined = this.categoryService.categories
      .find(c => c.category === category);

    if (cat) {
      this.onChangeCategoryOrCollection = true;
      this.data.categoryId = cat.category_id
    }
  }

  /** Updates data on change of collection */
  onChangeCollection(event: Event): void {
    const collection: string = (event.target as HTMLInputElement).value;

    if (!this.data.product) {
      return;
    }

    this.data.product.collection = collection;
    const col: CollectionResponse | undefined = this.collectionService.collections
      .find(c => c.collection === collection);

    if (col) {
      this.onChangeCategoryOrCollection = true;
      this.data.collectionId = col.collection_id;
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
    const col = this.data.collectionId ? this.data.collectionId : '';

    // Validation
    if (!name || !price || !desc || !product || !cat) {
      return of();
    }

    // Make call to server
    return this.productService.currency$.pipe(
      switchMap((currency) => {
        // Create payload
        const payload: UpdateProduct = {
          category_id: cat,
          collection_id: col,
          product_id: this.uuid,
          name: name,
          currency: currency,
          price: price,
          desc: desc.trim(),
          category: product.category,
          collection: !product.collection ? '' : product.collection
        };

        return this.updateProduct(payload);
      })
    );
  }

  /** Makes a call to our server to update a Product */
  private updateProduct(obj: UpdateProduct): Observable<number> {
    return this.productService.updateProduct(obj).pipe(
      switchMap((status: number) => {
        const res = of(status);

        const products$ = this.productService.currency$
          .pipe(switchMap((currency) =>
            this.productService.allProducts(0, 20, currency))
          );
        const categories$ = this.categoryService.fetchCategories();
        const collections$ = this.collectionService.fetchCollections();
        const combine$ = combineLatest([products$, categories$, collections$])
          .pipe(switchMap(() => res));

        // If user changes category or collection, refresh the arrays else only refresh products
        return this.onChangeCategoryOrCollection ? combine$ : products$.pipe(switchMap(() => res));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
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
      // view is a global click
      case 'view':
        break;

      case 'edit': {
        if (!this.product) {
          return;
        }

        const v: CustomUpdateVariant = {
          productId: this.uuid,
          productName: this.product.name,
          variant: {
            sku: content.data.sku,
            colour: content.data.colour,
            is_visible: content.data.is_visible,
            qty: content.data.inventory,
            size: content.data.size
          }
        }

        // Open Component
        const open = this.dialog.open(UpdateVariantComponent, {
          height: '400px',
          width: '600px',
          maxWidth: '100%',
          data: v,
        })

        this.afterComponentClose(open.afterClosed());
        break;
      }

      case 'delete': {
        // Delete Observable/Request
        const obs = this.updateProductService
          .deleteVariant(content.data.sku)
          .pipe(
            switchMap((status: number) => {
              return this.updateProductService
                .fetchProductDetails(this.uuid)
                .pipe(
                  tap((arr: ProductDetailResponse[]) => {
                    // On successful deletion, update productVariants$
                    const mapper = this.toCustomRowMapperArray(arr);
                    this.productVariants$ = of({ state: 'LOADED', data: mapper });
                  }),
                  switchMap(() => of(status))
                );
            })
          );

        this.dialog.open(DeleteComponent, {
          width: '500px',
          maxWidth: '100%',
          height: 'fit-content',
          data: {
            name: 'Product Variant ' + content.data.colour,
            asyncButton: obs
          }
        });

        break;
      }

      default:
        console.error('Invalid key');
    }
  }

}
