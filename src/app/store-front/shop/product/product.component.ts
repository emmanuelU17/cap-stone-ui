import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductDetail} from "../shop.helper";
import {Variant} from "../../../global-utils";
import {catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {ProductService} from "./product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CartService} from "../../order/cart/cart.service";
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
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);

  // Displays currency symbol
  currency = (str: string): string => this.footerService.currency(str);

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
  readonly productDetails$: Observable<{ state: string, error?: string, data?: ProductDetail[] }> = this.route.params
    .pipe(
      map((p: Params) => p as { path: string, id: string }),
      switchMap((obj) => this.footerService.currency$
        .pipe(map((c) => ({ currency: c, id: obj.id })))
      ),
      switchMap((object) => this.productService
        .productDetailsByProductUUID(object.id, object.currency)
        .pipe(
          map((arr) => {
            // Add all product detail to product array
            this.productDetailArray = arr;

            // First item in array
            const curr: ProductDetail = arr[0];

            // Current ProductDetail with the first item in arr
            this.currentProductDetail = { currImage: curr.url[0], detail: curr };

            return { state: 'LOADED', data: arr };
          }),
          startWith({ state: 'LOADING' }),
          catchError((e: HttpErrorResponse) =>
            of({ state: 'ERROR', error: e.error ? e.error.message : e.message })
          )
        )
      )
    );

  showMore = false; // Show more paragraph

  readonly form = this.fb.group({
    colour: new FormControl('', [Validators.required]),
    size: new FormControl({ value: '', disabled: true }, [Validators.required]),
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
    this.form.controls['size'].reset({ value: '', disabled: false });

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
  }

  /**
   * Makes call to server to persist item to user's cart
   * */
  addToCart = () => {
    return !this.productDetailArray
      .find(d => d.variants.find(v => v.sku === this.sku))
      ? of(0)
      : this.cartService.createCart({ sku: this.sku, qty: 1 });
  }

}
