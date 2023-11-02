import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {concatMap, delay, from, Observable, of, repeat, startWith, switchMap} from "rxjs";
import {HomeService} from "./home.service";
import {CardComponent} from "../utils/card/card.component";
import {Product} from "../store-front-utils";
import {Router} from "@angular/router";
import {CartService} from "../shop/cart/cart.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="min-h-screen w-full">
      <div class="trans relative flex justify-center items-center min-h-screen bg-center bg-no-repeat bg-cover"
           *ngIf="image$ | async as image" [style.background-image]="'url(' + image + ')'"
      >
        <h1 class="capitalize text-white bg-font">apparel for confident women</h1>
      </div>


      <ng-container *ngIf="products$ | async as products">
        <div class="lg-scr py-4">
          <div class="p-3.5 text-center">
            <h1 class="capitalize"> featured collection </h1>
          </div>

          <div class="p-2 xl:p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              *ngFor="let product of products; let i = index"
              (click)="clicked(product)"
            >
              <app-card
                [url]="product.image"
                [name]="product.name"
                [currency]="currency(product.currency)"
                [price]="product.price"
              ></app-card>
            </button>
          </div>

        </div>
      </ng-container>

    </div>
  `,
  styles: [
    `
      .trans {
        transition: all 2s ease;
        transition-delay: 1s, 250ms;
      }

      .bg-font {
        font-size: 30px;
      }

      @media only screen and (max-width: 600px) {
        .bg-font {
          font-size: calc(1vw + 18px);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private readonly cartService = inject(CartService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly router = inject(Router);

  currency = (str: string): string => this.cartService.currency(str);

  readonly products$ = this.homeService.products$;

  /**
   * Function achieves an infinite typing effect only difference is
   * this is done with images.
   * */
  private readonly images: string[] = this.homeService.bgImages;
  image$: Observable<string> = of(this.images).pipe(
    switchMap((photos: string[]) => from(photos)
      .pipe(
        concatMap((photo: string) => of(photo).pipe(delay(5000))),
        repeat()
      )
    ),
    startWith(this.images[0])
  );

  /** Route to product page */
  clicked(p: Product): void {
    this.router.navigate([`/shop/category/product/${p.product_id}`])
  }

}
