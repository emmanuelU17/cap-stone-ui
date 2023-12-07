import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent {

}
