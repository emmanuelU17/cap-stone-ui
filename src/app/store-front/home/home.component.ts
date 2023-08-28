import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HomeService} from "./home.service";
import {UtilsModule} from "../utils/utils.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UtilsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  bgImages$: Observable<string[]>;
  private image$ = new BehaviorSubject<string>('');
  _image$ = this.image$.asObservable();
  interval: number = 0;

  constructor(private homeService: HomeService, private render: Renderer2) {
    // Get bg images from HomeService on load of home page
    this.bgImages$ = this.homeService._bgImage$.pipe(
      tap((photos: string[]): void => this.image$.next(photos[0]))
    );
  }

  /**
   * On render of the page, a load a background image
   * For future reference, the reactive solution using rxjs.
   * https://www.youtube.com/watch?v=tWy8zaWvkvk
   * this.bgImage$ = this.bgImages$.pipe(
   *  switchMap((photos: string[], outerIndex: number) => from(photos).pipe(
   *   concatMap((photo: string, innerIndex: number) =>
   *    of(photo).pipe(delay(outerIndex === 0 && innerIndex === 0 ? 0 : 5000))
   *   ),
   *   repeat()
   *  ))
   * );
   * */
  ngOnInit(): void {
    const arr: string[] = this.homeService.getImageArray();
    let currentIndex: number = 0;

    this.interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % arr.length;
      this.image$.next(arr[currentIndex]);
    }, 5000);
  }

  /** Clear the time interval */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

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
