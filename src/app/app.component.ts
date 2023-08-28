import {ChangeDetectionStrategy, Component, HostListener, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {catchError, combineLatest, map, Observable, of, startWith} from "rxjs";
import {AppService} from "./service/app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CSRF} from "../global-utils/global-utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  navBg: any;

  csrf$: Observable<{ state: string, error?: string, csrf?: CSRF }>;

  combine$: Observable<{
    state: string,
    error?: string,
    // bgImages?: string[],
    // products?: Product[],
    // categories?: string[],
    // collections?: string[]
  }>;

  constructor(private appService: AppService, public route: Router, private renderer: Renderer2) {
    const csrf$ = this.appService.csrf();

    this.csrf$ = csrf$.pipe(
      map((c) => ({ state: 'LOADED' })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error }))
    );

    this.combine$ = combineLatest([csrf$]).pipe(
      map(([csrf]: [csrf: CSRF]) => ({ state: 'LOADED', csrf: csrf })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => of({ state: 'ERROR', error: err.error }))
    );
  }

  /** validates id route is an admin route */
  isAdmin(url: string): boolean {
    return url.startsWith('/admin');
  }

  /** Applies bg white on nav container when scrolled down */
  @HostListener('document:scroll') scroll(): void {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navBg = {
        'background-color': 'white',
        'border-bottom-color': 'black'
      }
    } else {
      this.navBg = {}
    }
  }

}
