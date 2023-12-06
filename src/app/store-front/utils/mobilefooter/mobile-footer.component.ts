import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-mobile-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full bg-red-500">
      <h2 class="text-base">follow us</h2>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileFooterComponent {

}
