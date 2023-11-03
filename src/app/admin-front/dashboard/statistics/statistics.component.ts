import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>statistics works!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent { }
