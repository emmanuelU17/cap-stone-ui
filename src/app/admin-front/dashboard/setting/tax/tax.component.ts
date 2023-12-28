import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tax.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxComponent {}
