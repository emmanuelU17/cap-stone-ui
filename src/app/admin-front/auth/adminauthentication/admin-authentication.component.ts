import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminAuthService} from "../admin-auth.service";
import {Router} from "@angular/router";
import {Observable, of, tap} from "rxjs";
import {LoginDto} from "../util";

@Component({
  selector: 'app-admin-authentication',
  templateUrl: './admin-authentication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthenticationComponent {
  private authService: AdminAuthService = inject(AdminAuthService);
  private router: Router = inject(Router);

  viewPassword = false;

  loginForm = new FormGroup({
    principal: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  /**
   * Method responsible for logging in a user. A lot of logic going on here but basically when a user clicks on login,
   * we display a spinner until we receive a response from the server.
   * @return void
   * */
  loginMethod(): Observable<number> {
    const principal: string | null | undefined = this.loginForm.get('principal')?.value;
    const password: string | null | undefined = this.loginForm.get('password')?.value;

    if (!principal || !password) {
      // TODO throw error
      return of();
    }
    const obj: LoginDto = {
      principal: principal,
      password: password
    };

    return this.authService
      .login({ principal: principal, password: password })
      .pipe(
        tap((status: number): void => {
          if (status >= 200 && status < 300) {
            this.loginForm.reset();
            this.router.navigate(['/admin/dashboard']);
          }
        })
      );
  }

}
