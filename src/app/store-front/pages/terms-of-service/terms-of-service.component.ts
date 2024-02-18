import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lg-scr mg-top p-2.5">
      Terms of Service Component
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceComponent {}
