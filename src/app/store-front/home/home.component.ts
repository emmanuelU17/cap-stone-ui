import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {CommonModule} from "@angular/common";
import {concatMap, delay, from, map, Observable, of, repeat, startWith, switchMap} from "rxjs";
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

  private readonly homeService: HomeService = inject(HomeService);

  readonly products$ = this.homeService.products$.pipe(
    map((arr) => {
      arr.forEach(e => e.image = 'assets/image/sarre1.jpg')
      return arr;
    })
  );

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

}
