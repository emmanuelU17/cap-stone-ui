import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {CommonModule} from "@angular/common";
import {concatMap, delay, from, Observable, of, repeat, startWith} from "rxjs";
import {HomeService} from "./home.service";
import {CardComponent} from "../utils/card/card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private homeService: HomeService = inject(HomeService);
  private render: Renderer2 = inject(Renderer2);

  // Get bg images from HomeService on load of home page
  bgImages$: Observable<string[]> = this.homeService._bgImage$;

  /**
   * Function achieves typing effect for home background image only difference is this is done with images.
   * Because I want to infinitely loop the items in array, Concat map because I want to way for the
   * iteration of inner array before emitting the next array
   * */
  private imageArr: string[] = this.homeService.getImageArray();
  image$: Observable<string> = of(this.imageArr).pipe(
    concatMap((photos: string[]) => {
      return from(photos).pipe(
        concatMap((photo: string) => {
          return of(photo).pipe(delay(5000));
        }),
        repeat()
      )
    }),
    startWith(this.imageArr[0])
  );

  /** Displays the next item in products. */
  next(): void {
    const container = this.render.selectRootElement('.img-slider', true);
    let dimension = container.getBoundingClientRect();
    let width = dimension.width;
    container.scrollLeft += width;
  }

  /** Displays the previous item in products. */
  previous(): void {
    const container = this.render.selectRootElement('.img-slider', true);
    let dimension = container.getBoundingClientRect();
    let width = dimension.width;
    container.scrollLeft -= width;
  }

}
