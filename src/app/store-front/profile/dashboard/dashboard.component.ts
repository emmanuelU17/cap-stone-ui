import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lg-scr mg-top min-h-full bg-blue-400">Dashboard protected</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

}
