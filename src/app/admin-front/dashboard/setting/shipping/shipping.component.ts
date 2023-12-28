import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShippingComponent {}
