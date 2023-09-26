import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {CommonModule} from "@angular/common";
import {concatMap, delay, from, Observable, of, repeat, startWith, switchMap} from "rxjs";
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
  // Get bg images from HomeService on load of home page
  bgImages$: Observable<string[]> = this.homeService._bgImage$;
  private render: Renderer2 = inject(Renderer2);
  /**
   * Function achieves an infinite typing effect only difference is
   * this is done with images.
   * */
  private imageArr: string[] = this.homeService.getImages;
  image$: Observable<string> = of(this.imageArr).pipe(
    switchMap((photos: string[]) => from(photos).pipe(
      concatMap((photo: string) => of(photo).pipe(delay(5000))), repeat()
      )
    ),
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
