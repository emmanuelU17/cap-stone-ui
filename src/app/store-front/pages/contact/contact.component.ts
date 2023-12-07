import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lg-scr mg-top p-2.5">
      contact works
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {}
