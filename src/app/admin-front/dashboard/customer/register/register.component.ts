import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DirectiveModule} from "@/app/directive/directive.module";
import {Observable, of, tap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {AuthService} from "@/app/service/auth.service";
import {RegisterDTO} from '@/app/global-utils';

@Component({
  selector: 'app-register',
  standalone: true,
  template: `
    <form class="h-full flex flex-col px-0" [formGroup]="form">
      <!-- Title-container -->
      <div class="flex py-2.5 px-0 mb-4">
        <button type="button"
                class="mr-1.5 md:px-2.5 border-[var(--border-outline)] border"
                (click)="routeToListCustomerComponent()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
          </svg>
        </button>
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">Register new user</h1>
      </div>

      <!-- Contents -->
      <div class="space-y-4 md:space-y-6">
        <!-- name -->
        <div>
          <label for="fName" class="block mb-2 text-sm font-medium text-gray-900">Firstname</label>
          <input type="text"
                 formControlName="firstname"
                 id="fName"
                 placeholder="first name"
                 class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
          >
        </div>
        <div>
          <label for="lName" class="block mb-2 text-sm font-medium text-gray-900">Lastname</label>
          <input type="text"
                 formControlName="lastname"
                 id="lName"
                 placeholder="last name"
                 class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
          >
        </div>

        <!-- email -->
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
          <input type="email"
                 id="email"
                 formControlName="email"
                 placeholder="example@example.com"
                 class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
          >
        </div>

        <!-- phone -->
        <div>
          <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">
            Phone number <span class="text-xs text-red-500">*(in the format 000-000-0000)</span>
          </label>
          <input type="tel"
                 formControlName="phone"
                 id="phone"
                 placeholder="000-000-0000"
                 class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
          >
        </div>

        <!-- password -->
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
          <div class="flex flex-1 gap-2.5">
            <input [type]="viewPassword ? 'text' : 'password'"
                   formControlName="password"
                   id="password"
                   placeholder="password"
                   class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
            >
            <button type="button" class="outline-none border-none bg-transparent"
                    (click)="viewPassword = !viewPassword"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>

        </div>

        <!-- confirm password -->
        <div>
          <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
          <input [type]="viewPassword ? 'text' : 'password'"
                 name="confirm-password"
                 formControlName="cPassword"
                 id="confirm-password"
                 placeholder="confirm password"
                 class="
             bg-gray-50 border border-gray-300 text-gray-900
             sm:text-sm rounded-md block w-full p-2.5
             "
          >
        </div>
      </div>

      <!-- Button ctn -->
      <div class="mt-5 flex justify-between">
        <button mat-stroked-button color="warn"
                style="border-color: red"
                type="button"
                (click)="routeToListCustomerComponent()"
        >cancel</button>
        <button
          class="text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
          type="submit"
          [disabled]="form.invalid || passwordError()"
          [style]="{ 'background-color': form.valid && !passwordError() ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
          [asyncButton]="submit()"
        >register</button>
      </div>

    </form>
  `,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  viewPassword = false;

  readonly form = this.fb.group({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]),
    password: new FormControl('', [Validators.required]),
    cPassword: new FormControl('', [Validators.required]),
  });

  routeToListCustomerComponent = (): void => {
    this.router.navigate(['/admin/dashboard/customer']);
  }

  passwordError = (): boolean => {
    const password = this.form.controls['password'].value;
    const cPassword = this.form.controls['cPassword'].value;
    return (!password || !cPassword) || (password !== cPassword);
  };

  submit(): Observable<number> {
    const firstname = this.form.controls['firstname'].value;
    const lastname = this.form.controls['lastname'].value;
    const email = this.form.controls['email'].value;
    const phone = this.form.controls['phone'].value;
    const password = this.form.controls['password'].value;
    const cPassword = this.form.controls['cPassword'].value;

    if (!firstname || !lastname || !email || !phone || !password || !cPassword) {
      return of();
    }

    const payload: RegisterDTO = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: '',
      phone: phone,
      password: password
    }

    return this.authService.register(payload, 'api/v1/worker/auth/register')
      .pipe(
        tap((status): void => {
          if (status >= 200 && status < 300) {
            for (let key in this.form.controls) {
              this.form.get(`${key}`)?.setValue('');
            }
          } // end of if
        })
      );
  }
}
