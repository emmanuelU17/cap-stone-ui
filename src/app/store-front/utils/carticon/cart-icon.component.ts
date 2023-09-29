import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {CartIconService} from "./cart-icon.service";

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconComponent {
  private readonly service = inject(CartIconService);
  count$ = this.service.count$;
}
