import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() url: string = '';
  @Input() name: string = '';
  @Input() currency: string = '';
  @Input() price: number = 0;
}
