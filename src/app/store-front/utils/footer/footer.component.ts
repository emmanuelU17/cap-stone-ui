import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="p-3 flex">
        <p class="p-2 bg-red-500">footer works!</p>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { }
