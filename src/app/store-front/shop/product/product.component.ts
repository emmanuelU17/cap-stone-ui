import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductDetail} from "../shop.helper";
import {State} from "../../../../global-utils/global-utils";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
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

  showMore: boolean = false; // Show more paragrap

  private id: string | null = this.route.snapshot.paramMap.get('id');
  private uuid: string = this.id === null ? '' : this.id;

  // Fetch ProductDetail on load of application
  productDetails$: Observable<State<ProductDetail[]>> = this.productService
    .fetchProductDetails(this.uuid)
    .pipe(
      map((arr: ProductDetail[]): State<ProductDetail[]> => {
        const curr: ProductDetail = arr[0];
        curr.url = [
          './assets/image/sarre1.jpg',
          './assets/image/sarre2.jpg',
          './assets/image/sarre3.jpg',
          './assets/image/sara-the-brand.png',
        ];

        // Update global variable
        this.detail = curr;

        // Onload of application, pre-populate the necessary fields
        this.reactiveForm.controls['sku'].setValue(curr.sku);

        curr.desc = this.lorem

        this.currItemSubject$.next({currImage: curr.url[0], detail: curr});
        return {state: 'LOADED', data: arr};
      }),
      startWith({state: 'LOADING'}),
      catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
    );

  // Instead of defining undefined, in currItemSubject$, chose dummy values
  // Note this is updated in the constructor also
  private detail: ProductDetail = {
    name: '',
    currency: '',
    price: 0,
    desc: '',
    sku: '',
    size: '',
    colour: '',
    url: [],
  }

  private currItemSubject$ =
    new BehaviorSubject<{ currImage: string, detail: ProductDetail }>({currImage: '', detail: this.detail});
  currentItem$ = this.currItemSubject$.asObservable();

  reactiveForm = new FormGroup({
    sku: new FormControl({value: '', disabled: true}, [Validators.required]),
    size: new FormControl('', [Validators.required]),
    colour: new FormControl('', [Validators.required]),
    qty: new FormControl('', [Validators.required]),
  });

  lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aspernatur consequatur dolore, error fuga\n' +
    '          inventore, iste maxime molestias nostrum, numquam tempora totam voluptatem voluptatibus? At blanditiis\n' +
    '          consequatur delectus et laudantium obcaecati quos recusandae saepe sint ut? Ab adipisci consequuntur est fuga,\n' +
    '          incidunt molestias nihil omnis perspiciatis sunt! Amet eveniet excepturi fugiat iure omnis, sequi. Ad delectus\n' +
    '          eius excepturi magnam officia possimus. Deleniti quod, vero. Culpa cumque, esse exercitationem fugiat iure non\n' +
    '          porro? Animi assumenda consequatur cumque cupiditate distinctio, eligendi explicabo magni modi necessitatibus,\n' +
    '          nisi porro, quisquam sit tenetur? Consequatur deserunt dolore dolorem dolores facere illo labore odit optio,\n' +
    '          perspiciatis, quae quasi quia quidem, repellendus reprehenderit sit totam ullam voluptatibus. Animi architecto\n' +
    '          autem consequatur dolores, eaque ex ipsam minus nostrum provident, quod reiciendis sapiente sed vitae.\n' +
    '          Adipisci, amet aut, consectetur, corporis enim esse maiores maxime nulla reiciendis repellat similique\n' +
    '          tempore. Accusantium ad alias atque blanditiis, consectetur cum distinctio dolore ea exercitationem facilis\n' +
    '          iusto laboriosam laudantium modi nam nesciunt officia omnis pariatur placeat quidem quod reprehenderit sed\n' +
    '          tempora veritatis voluptatem voluptatum! Accusamus asperiores at corporis earum eius eligendi excepturi,\n' +
    '          fugiat in libero magni minus, molestiae nam neque non nostrum nulla pariatur porro provident quaerat qui\n' +
    '          quis reprehenderit sequi suscipit ullam veritatis voluptatibus.'

  /***/
  onclickColour(event: Event): void {
    const sku: string = (event.target as HTMLInputElement).value;

    this.currentItem$ = this.productDetails$.pipe(
      map((arr: State<ProductDetail[]>) => {
        const obj = {state: 'LOADED', data: arr};
        const dummyRes = {currImage: this.detail.url[0], detail: this.detail};

        if (!obj.data.data) {
          return dummyRes;
        }

        const detail: ProductDetail | undefined = obj.data.data.find((det: ProductDetail): boolean => det.sku === sku);

        if (!detail) {
          return dummyRes;
        }

        this.reactiveForm.controls['sku'].setValue(detail.sku)

        return {currImage: detail.url[0], detail: detail};
      })
    );
  }

  /** Stores product in users cart */
  addToCart(): void {
  }

}
