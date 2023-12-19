import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {concatMap, delay, from, Observable, of, repeat, startWith, switchMap} from "rxjs";
import {HomeService} from "./home.service";
import {CardComponent} from "../utils/card/card.component";
import {Product} from "../store-front-utils";
import {Router, RouterLink} from "@angular/router";
import {FooterService} from "../utils/footer/footer.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterLink],
  template: `
    <div class="min-h-screen w-full">
      <div class="trans flex min-h-screen bg-center bg-no-repeat bg-cover"
           *ngIf="image$ | async as image" [style.background-image]="'url(' + image + ')'"
      >
        <div class="lg-scr relative">
          <div class="pb-3 ml-5 inline-block overflow-hidden whitespace-nowrap absolute bottom-0 left-0">
            <h1 class="bg-font uppercase font-bold text-white">clothing apparel for the confident women</h1>
            <a routerLink="/shop/category"
               class="text-sm md:text-lg capitalize text-white cursor-pointer border-b border-b-white"
            >shop now</a>
          </div>
        </div>
      </div>


      <ng-container *ngIf="products$ | async as products">
        <div class="lg-scr py-4">
          <div class="p-3.5 flex justify-center">
            <h1 class="feature-font w-fit capitalize font-bold text-[var(--app-theme)] border-b border-b-[var(--app-theme)]"
            >featured collection</h1>
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
        font-size: 40px;
      }

      .feature-font {
        font-size: 20px;
      }

      @media only screen and (max-width: 768px) {
        .bg-font, .feature-font {
          font-size: calc(13px + 1vw);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private readonly footerService = inject(FooterService);
  private readonly homeService = inject(HomeService);
  private readonly router = inject(Router);

  currency = (str: string): string => this.footerService.currency(str);

  readonly products$ = this.homeService.products$;

  /**
   * Function achieves an infinite typing effect only difference is
   * this is done with images.
   * */
  private readonly images = this.homeService.bgImages;
  image$: Observable<string> = of(this.images).pipe(
    switchMap((photos: string[]) => from(photos)
      .pipe(
        concatMap((photo: string) => of(photo).pipe(delay(5000))),
        repeat()
      )
    ),
    startWith(this.images[0])
  );

  /**
   * Route to product page
   * */
  clicked(p: Product): void {
    this.router.navigate([`/shop/category/product/${p.product_id}`]);
  }

}
