import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {Observable, of, tap} from "rxjs";
import {LoginDto} from "../util";

@Component({
  selector: 'app-admin-authentication',
  templateUrl: './admin-authentication.component.html',
  styleUrls: ['./admin-authentication.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthenticationComponent {
  errorMessage: string = '';
  viewPassword = false;

  loginForm = new FormGroup({
    principal: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) { }

  sub(): void { }

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

    return this.authService.login(obj).pipe(
      tap((status: number): void => {
        if (status >= 200 && status < 300) {
          this.loginForm.reset();
          this.router.navigate(['/admin/dashboard']);
        }
      })
    );
  }

}
