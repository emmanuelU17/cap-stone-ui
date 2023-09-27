import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppService} from "./service/app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CSRF} from "./global-utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  private readonly appService: AppService = inject(AppService);

  // Onload of application, retrieve CSRF token
  csrf$: Observable<{ state: string, error?: string, csrf?: CSRF }> = this.appService.csrf().pipe(
    map(() => ({state: 'LOADED'})),
    startWith({state: 'LOADING'}),
    catchError((err: HttpErrorResponse) => of({state: 'ERROR', error: err.error.message}))
  );

}
