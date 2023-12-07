import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-refund',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lg-scr mg-top p-2.5">
      RefundComponent
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundComponent { }
