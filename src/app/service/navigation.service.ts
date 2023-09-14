import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router: Router = inject(Router);

  /** Navigates back to the previous page based on param supplied */
  navigateBack(url: string): void {
    this.router.navigate([url]);
  }

}
