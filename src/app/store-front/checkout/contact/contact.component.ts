import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `Contact component works`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent { }
