import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {DirectiveModule} from "../../../../directive/directive.module";
import {AuthService} from "../../../../service/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule],
  template: `
    <form class="w-fit max-[768px]:w-full py-3 px-4 appearance-none shadow-md
      outline-none border-none block rounded-lg bg-[var(--white)]" [formGroup]="form">

      <div class="mb-4 flex flex-col justify-center items-center">

        <div class="justify-center items-center min-w-[3.5rem] min-h-[3.5rem] max-h-[6.25rem] max-w-[6.25rem] aspect-h-1 aspect-w-1 overflow-hidden">
          <img src="./assets/image/sara-the-brand.png" class="h-full w-full object-cover object-center lg:h-full lg:w-full" alt="logo">
        </div>

        <p class="text-center" [style]="{ 'display': displayMessage ? 'block' : 'none' }">Functionality not implement</p>
      </div>

      <!-- Inputs -->
      <div class="flex gap-2.5 max-[768px]:flex-col">
        <!-- Email -->
        <input type="text"
               name="principal"
               formControlName="principal"
               class="bg-gray-200 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="Email">

        <!-- Password -->
        <div class="flex flex-1 gap-2.5">
          <input [type]="viewPassword ? 'text' : 'password'"
                 name="password"
                 formControlName="password"
                 class="w-full bg-gray-200 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="Password">
          <button type="button" class="outline-none border-none bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Submit -->
      <div class="w-full flex mt-2.5 justify-end">
        <button type="button"
                class="text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
                [style]="{ 'background-color': form.valid ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
                [asyncButton]="login()"
        >login</button>
      </div>

      <!-- Login with google -->
      <div class="mt-2">
        <div class="mt-4 flex items-center justify-between">
          <span class="border-b w-1/5 lg:w-1/4"></span>
          <a class="text-xs text-center text-gray-500 uppercase">or login with</a>
          <span class="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div class="flex justify-between gap-4">

          <!-- login with google -->
          <button type="button"
                  class="px-1.5 gap-1.5 flex items-center justify-center mt-4 text-white rounded-sm shadow-md bg-gray-100 hover:bg-gray-300">
            <div class="">
              <svg class="h-6 w-6" viewBox="0 0 40 40">
                <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#FFC107" />
                <path
                    d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                    fill="#FF3D00" />
                <path
                    d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                    fill="#4CAF50" />
                <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#1976D2" />
              </svg>
            </div>
            <h1 class="font-app-card text-center text-blue-400">Login with Google</h1>
          </button>

          <!-- register -->
          <button type="button" (click)="displayRegister('register')"
              class="p-2 gap-1.5 mt-4 flex justify-between rounded-sm shadow-md bg-gray-100 hover:bg-gray-300"
          >
            <h3 class="text-center text-gray-600">Don't have an account?</h3>
            <h1 class="text-center text-blue-400">Register</h1>
          </button>

        </div>

      </div>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  @Output() emitter = new EventEmitter<string>();

  viewPassword = false;
  displayMessage = false;

  form = this.fb.group({
    principal: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  /**
   * Informs parent component to display register component
   * */
  displayRegister(template: string): void {
    this.emitter.emit(template);
  }

  login(): Observable<number> {
    const principal: string | null = this.form.controls['principal'].value;
    const password: string | null = this.form.controls['password'].value;

    return (!principal || !password)
      ? of()
      : this.authService.login(
          { principal: principal, password: password },
            'api/v1/client/auth/login',
            '/profile/dashboard'
        );
  }

}
