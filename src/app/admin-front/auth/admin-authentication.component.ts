import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdminAuthService} from "./admin-auth.service";
import {Router} from "@angular/router";
import {catchError, Observable, of, tap} from "rxjs";
import {CommonModule} from "@angular/common";
import {DirectiveModule} from "../../directive/directive.module";
import {ToastService} from "../../service/toast/toast.service";
import {MatDialogModule} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-admin-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, MatDialogModule],
  templateUrl: './admin-authentication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthenticationComponent {
  private authService: AdminAuthService = inject(AdminAuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private toastService: ToastService = inject(ToastService)

  viewPassword = false;

  loginForm = this.fb.group({
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

    return this.authService
      .login({ principal: principal, password: password })
      .pipe(
        tap((status: number): void => {
          if (status >= 200 && status < 300) {
            this.loginForm.reset();
            this.router.navigate(['/admin/dashboard/statistics']);
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error.message);
          return of(err.status);
        })
      );
  }

}
