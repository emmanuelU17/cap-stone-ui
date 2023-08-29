import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent { }
