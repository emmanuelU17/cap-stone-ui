import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() url: string = '';
  @Input() name: string = '';
  @Input() currency: string = '';
  @Input() price: number = 0;
}
