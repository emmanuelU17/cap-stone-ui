import {CanMatchFn, Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";

export const pathGuard: CanMatchFn = () => {
  const router: Router = inject(Router);

  return router.events.pipe(
    filter((event: Event): boolean => event instanceof NavigationEnd || event instanceof NavigationStart),
    map((event: Event): boolean => {
      const url = event as NavigationEnd;
      console.log('URL ', url);
      return url.url.startsWith('/admin');
    })
  );
}
