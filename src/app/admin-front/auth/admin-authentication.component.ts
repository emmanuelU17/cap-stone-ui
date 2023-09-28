import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdminAuthService} from "./admin-auth.service";
import {Observable, of} from "rxjs";
import {CommonModule} from "@angular/common";
import {DirectiveModule} from "../../directive/directive.module";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-admin-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, MatDialogModule],
  templateUrl: './admin-authentication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthenticationComponent {

  private readonly authService: AdminAuthService = inject(AdminAuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);

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
    const principal = this.loginForm.controls['principal'].value;
    const password = this.loginForm.controls['password'].value;

    if (!principal || !password) {
      return of();
    }

    return this.authService.login({ principal: principal, password: password });
  }

}
