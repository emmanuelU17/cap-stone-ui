import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <div class="w-full text-center">
      <h1 class="cx-font-size">&copy; <span class="year">{{year}}</span> | Designed by
        <a
          class="m-0 text-[var(--black)]"
          href="https://emmanueluluabuike.com/"
          target="_blank"
        >E.U</a> | All Rights Reserved
      </h1>
    </div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
