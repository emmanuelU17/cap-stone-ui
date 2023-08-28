import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteComponent {

}
