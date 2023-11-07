import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-shop',
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent { }
