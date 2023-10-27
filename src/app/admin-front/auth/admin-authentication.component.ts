import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {CommonModule} from "@angular/common";
import {DirectiveModule} from "../../directive/directive.module";
import {MatDialogModule} from "@angular/material/dialog";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-admin-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, MatDialogModule],
  template: `
    <div class="h-full flex justify-center items-center bg-[var(--all-background)]">
      <form [formGroup]="loginForm" class="w-fit py-3 px-4 appearance-none shadow-md outline-none border-none block rounded-lg bg-[var(--white)]">
        <div class="mb-1.5 flex flex-col justify-center items-center">
          <div class="justify-center items-center min-w-[3.5rem] min-h-[3.5rem] max-h-[6.25rem] max-w-[6.25rem] aspect-h-1 aspect-w-1 overflow-hidden">
            <img src="./assets/image/sara-the-brand.png" class="h-full w-full object-cover object-center lg:h-full lg:w-full" alt="logo">
          </div>

          <p class="font-app-card text-center">
            email: <strong class="mr-1.5">admin@admin.com</strong>
            password: <strong>password123</strong>
          </p>
        </div>

        <!-- Inputs -->
        <div class="flex gap-2.5 max-[768px]:flex-col">
          <!-- Email -->
          <input type="text"
                 name="principal"
                 class="bg-gray-200 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="email"
                 formControlName="principal">

          <!-- Password -->
          <div class="flex flex-1 gap-2.5">
            <input [type]="viewPassword ? 'text' : 'password'"
                   name="password"
                   class="w-full bg-gray-200 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   placeholder="password"
                   formControlName="password">
            <button type="button" class="outline-none border-none bg-transparent" (click)="viewPassword = !viewPassword">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <div class="w-full flex mt-2.5 justify-end">
          <button type="submit"
                  class="text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
                  [disabled]="!loginForm.valid"
                  [style]="{ 'background-color': loginForm.valid ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
                  [asyncButton]="loginMethod()"
          >login</button>
        </div>

      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthenticationComponent {

  private readonly authService = inject(AuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  viewPassword = false;

  loginForm = this.fb.group({
    principal: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  /**
   * Method responsible for logging in a user. A lot of logic going on here but basically when a user clicks on login,
   * we display a spinner until we receive a response from the server.
   *
   * @return void
   * */
  loginMethod(): Observable<number> {
    const principal: string | null = this.loginForm.controls['principal'].value;
    const password: string | null = this.loginForm.controls['password'].value;
    return (!principal || !password)
    ? of()
    : this.authService.login(
        { principal: principal, password: password },
        'api/v1/worker/auth/login',
        '/admin/dashboard'
    );
  }

}
