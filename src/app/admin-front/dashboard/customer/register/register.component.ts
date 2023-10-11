import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {SizeInventoryComponent} from "../../sizeinventory/size-inventory.component";
import {Router} from "@angular/router";
import {DirectiveModule} from "../../../../directive/directive.module";
import {Observable, of, tap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {CustomerService} from "../customer.service";
import {RegisterDTO} from "../customer.routes";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SizeInventoryComponent, DirectiveModule, MatButtonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  private readonly service = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('username', Validators.required),
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
  viewPassword = false;

  submit(): Observable<number> {
    const firstname = this.form.controls['firstname'].value;
    const lastname = this.form.controls['lastname'].value;
    const email = this.form.controls['email'].value;
    const username = this.form.controls['username'].value;
    const phone = this.form.controls['phone'].value;
    const password = this.form.controls['password'].value;
    const cPassword = this.form.controls['cPassword'].value;

    if (!firstname || !lastname || !email || !username || !phone || !password || !cPassword) {
      return of(0);
    }

    const payload: RegisterDTO = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      phone: phone,
      password: password
    }

    return this.service.registerUser(payload)
      .pipe(
        tap((status): void => {
          if (status >= 200 && status < 300) {
            this.form.reset({
              'firstname': '',
              'lastname': '',
              'email': '',
              'username': 'username',
              'phone': '',
              'password': '',
              'cPassword': ''
            });
          } // end of if
        })
      );
  }
}
