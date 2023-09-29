import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css']
})
export class CartIconComponent {

  @Input() route!: string;

}
