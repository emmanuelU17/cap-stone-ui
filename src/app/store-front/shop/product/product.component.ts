import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductDetail} from "../shop.helper";
import {State, Variant} from "../../../global-utils";
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../service/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  private productService: ProductService = inject(ProductService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  showMore: boolean = false; // Show more paragraph

  private id: string | null = this.route.snapshot.paramMap.get('id');
  private uuid: string = this.id === null ? '' : this.id;

  // Fetch ProductDetail on load of application
  productDetails$: Observable<State<ProductDetail[]>> = this.productService
    .fetchProductDetails(this.uuid)
    .pipe(
      map((arr: ProductDetail[]): State<ProductDetail[]> => {
        // Add all colours to colourSubject
        const colours: string[] = [];
        arr.forEach((detail: ProductDetail) => colours.push(detail.colour));
        this.coloursSubject$.next(colours);

        // First item in array
        const curr: ProductDetail = arr[0];
        // For testing, append images
        // curr.url = [
        //   './assets/image/sarre1.jpg',
        //   './assets/image/sarre2.jpg',
        //   './assets/image/sarre3.jpg',
        //   './assets/image/sara-the-brand.png',
        // ];

        // Current ProductDetail with the first item in arr
        this.currItemSubject$.next({ currImage: curr.url[0], detail: curr });

        return {state: 'LOADED', data: arr};
      }),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
    );

  private coloursSubject$ = new BehaviorSubject<string[]>([]);
  colours$ = this.coloursSubject$.asObservable();

  private currItemSubject$ =
    new BehaviorSubject<{ currImage: string, detail: ProductDetail } | undefined>(undefined);
  currentItem$ = this.currItemSubject$.asObservable();

  reactiveForm = new FormGroup({
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    size: new FormControl('', [Validators.required]),
    colour: new FormControl('', [Validators.required]),
    qty: new FormControl('', [Validators.required]),
  });

  /**
   * Since a Product always has a unique colour, when a cx wants a different Product variant,
   * we use the colour to find it.
   *
   * @param event is of type Event but contains a value colour
   * @return void
   * */
  onclickColour(event: Event): void {
    const colour: string = (event.target as HTMLInputElement).value;
    this.currentItem$ = this.productDetails$.pipe(
      map((state: State<ProductDetail[]>) => {
        // PAUSE
        const detail: ProductDetail | undefined = state.data?.find((d: ProductDetail): boolean => d.colour === colour);
        return detail ? { currImage: detail.url[0], detail: detail } : undefined;
      })
    );
  }

  currentSKU$(): Observable<string> {
    const size = this.reactiveForm.get('size')?.value;
    const colour = this.reactiveForm.get('colour')?.value;

    if (!size || !colour) {
      return of('Filter Product');
    }

    return this.productDetails$.pipe(
      // SwitchMap
      switchMap((state: State<ProductDetail[]>) => {
        if (!state.data) {
          return of('Filter Product');
        }
        const details: ProductDetail[] = state.data;

        const found: ProductDetail | undefined = details.find((d: ProductDetail) => d.colour === colour);

        if (!found) {
          return of('Filter Product');
        }

        const sku: Variant | undefined = found.variants.find((v: Variant) => v.size === size);

        if (!sku) {
          return of('Filter Product');
        }

        return of(sku.sku);
      }),
    );
  }

  /** Stores product in users cart */
  addToCart(): void {
    const s = this.reactiveForm.get('size')?.value;
  }

}
