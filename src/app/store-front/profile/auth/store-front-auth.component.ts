import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-store-front-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-front-auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreFrontAuthComponent {
  viewPassword = false;
  displayMessage = false;
}
