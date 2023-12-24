import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Angular4PaystackModule} from "angular4-paystack";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, Angular4PaystackModule],
  template: `

    
      <div class="mg-top">
          <angular4-paystack
                  [email]="'mailexample@mail.com'"
                  [key]="''"
                  [amount]="5000000"
                  [ref]="reference"
                  [channels]="['card']"
                  [class]="'btn btn-primary'"
                  (onClose)="paymentCancel()"
                  (callback)="paymentDone($event)"
          >
              Pay with Paystack
          </angular4-paystack>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent {

  reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  constructor() {}

  paymentInit(): void {
    console.log('Payment initialized');
  }

  paymentDone(ref: any): void {
    console.log('Payment done ', ref);
  }

  paymentCancel(): void {
    console.log('payment failed');
  }

}
