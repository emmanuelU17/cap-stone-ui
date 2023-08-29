import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-store-front-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-front-auth.component.html',
  styleUrls: ['./store-front-auth.component.css']
})
export class StoreFrontAuthComponent {
  viewPassword = false;
  displayMessage = false;
}
