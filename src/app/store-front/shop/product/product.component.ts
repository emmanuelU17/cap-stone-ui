import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductDetail} from "../shop.helper";
import {State, Variant} from "../../../global-utils";
import {catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {ProductService} from "./product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ShopService} from "../shop.service";
import {CartService} from "../../checkout/cart/cart.service";
import {DirectiveModule} from "../../../directive/directive.module";
import {FooterService} from "../../utils/footer/footer.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DirectiveModule],
  templateUrl: './product.component.html',
  styles: [`
    .show {
      overflow: visible;
      height: auto;
    }

    /* width */
    ::-webkit-scrollbar {
      height: 5px;
      width: 5px;
      margin-top: 10px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #bec4c4;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {

  private readonly footerService = inject(FooterService);
  private readonly productService = inject(ProductService);
  private readonly utilService = inject(ShopService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);

  // Displays number of items available in stock
  range = (num: number): number[] => this.utilService.getRange(num);

  // Displays currency symbol
  currency = (str: string): string => this.cartService.currency(str);

  // ProductDetail array and Current ProductDetail
  private productDetailArray: ProductDetail[] = [];
  private currentColourSize = { colour: '', size: '' };
  inventory = -1;
  currentProductDetail?: { currImage: string, detail: ProductDetail };
  sku = '';

  /**
   * Retrieves product id from the route param and then refreshes page.
   * https://angular.io/api/router/ActivatedRoute#snapshot
   * */
  productDetails$: Observable<State<ProductDetail[]>> = this.route.params
    .pipe(
      switchMap((param: Params) => {
        const obj = param as { path: string, id: string }

        return this.footerService.currency$
          .pipe(
            switchMap((currency) => this.productService
              .productDetailsByProductUUID(obj.id, currency)
              .pipe(
                map((arr: ProductDetail[]): State<ProductDetail[]> => {
                  // Add all product detail to product array
                  this.productDetailArray = arr;

                  // First item in array
                  const curr: ProductDetail = arr[0];

                  // Current ProductDetail with the first item in arr
                  this.currentProductDetail = { currImage: curr.url[0], detail: curr };

                  return { state: 'LOADED', data: arr };
                }),
                startWith({ state: 'LOADING' }),
                catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.message }))
              )
            )
          );
      })
    );

  showMore: boolean = false; // Show more paragraph

  reactiveForm = this.fb.group({
    colour: new FormControl('', [Validators.required]),
    size: new FormControl({ value: '', disabled: true }, [Validators.required]),
    qty: new FormControl({ value: '', disabled: true }, [Validators.required]),
  });

  /**
   * Updates currentProductDetail on the colour clicked.
   *
   * @param event is of type Event but contains a value colour
   * @return void
   * */
  onclickColour(event: Event): void {
    const colour: string = (event.target as HTMLInputElement).value;
    const findProductDetail: ProductDetail | undefined = this.productDetailArray
      .find((d: ProductDetail) => d.colour === colour);

    if (!findProductDetail) {
      return;
    }

    this.currentColourSize.colour = colour;

    // Reset dependent FormControls
    this.reactiveForm.controls['size'].reset({ value: '', disabled: false });
    this.reactiveForm.controls['qty'].reset({ value: '', disabled: true });

    // Update currentProductDetail
    this.currentProductDetail = { currImage: findProductDetail.url[0], detail: findProductDetail };
  }

  /**
   * Updates reactive form on the size clicked.
   *
   * @param event is of type Event value is size
   * @return void
   * */
  onselectSize(event: Event): void {
    const size: string = (event.target as HTMLInputElement).value;

    const findProductDetail: ProductDetail | undefined = this.productDetailArray
      .find((d: ProductDetail) => d.colour === this.currentColourSize.colour);

    if (!findProductDetail) {
      return;
    }

    const findVariant: Variant | undefined = findProductDetail.variants
      .find((v: Variant) => v.size === size);

    if (!findVariant) {
      return;
    }

    // Update necessary details for the UI
    this.sku = findVariant.sku;
    this.currentColourSize.size = size;
    this.inventory = Number(findVariant.inventory);

    // reset qty element
    this.reactiveForm.controls['qty'].reset({ value: '', disabled: false });
  }

  /** Stores product in users cart */
  addToCart(): Observable<number> {
    const detail = this.productDetailArray
      .find(d => d.variants.find(v => v.sku === this.sku));

    const qty = this.reactiveForm.controls['qty'].value

    if (!detail || qty === null || qty.length === 0) {
      return of();
    }

    // Api call to add to cart
    return this.cartService.createCart({ sku: this.sku, qty: Number(qty) });
  }

}
