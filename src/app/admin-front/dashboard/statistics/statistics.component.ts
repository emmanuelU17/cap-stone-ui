import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  template: `
    <p>statistics works!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent { }
