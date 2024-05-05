import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _snackBar = inject(MatSnackBar);

  /**
   * Opens snack bar for 5 seconds
   * */
  toastMessage(message: string): void {
    this._snackBar.openFromComponent(ToastComponent, {
      duration: 5000,
      data: message,
    });
  }
}
