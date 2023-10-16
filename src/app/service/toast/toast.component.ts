import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `<p>{{ message }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) { }
}
