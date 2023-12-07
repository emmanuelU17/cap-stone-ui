import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppService} from "./service/app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CSRF} from "./global-utils";

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="csrf$ | async as csrf" [ngSwitch]="csrf.state">

      <ng-container *ngSwitchCase="'LOADING'">
        <div class="lg-scr h-full p-20 flex justify-center items-center">
          <h1 class="capitalize text-[var(--app-theme-hover)]">
            loading...
          </h1>
        </div>
      </ng-container>

      <ng-container *ngSwitchCase="'ERROR'">
        <div class="lg-scr p-10 text-3xl text-red-500">
          Please try again later as server is undergoing maintenance
        </div>
      </ng-container>

      <ng-container *ngSwitchCase="'LOADED'">
        <router-outlet></router-outlet>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  private readonly appService = inject(AppService);

  // Onload of application, retrieve CSRF token
  csrf$: Observable<{ state: string, error?: string, csrf?: CSRF }> = this.appService.csrf()
    .pipe(
      map(() => ({ state: 'LOADED' })),
      startWith({ state: 'LOADING' }),
      catchError((err: HttpErrorResponse) => {
        const message = err.error ? err.error.message : err.message;
        return of({ state: 'ERROR', error: message });
      })
  );

}
