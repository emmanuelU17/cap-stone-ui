import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DeleteData} from "./delete-data";
import {DirectiveModule} from "../../../directive/directive.module";
import {catchError, map, Observable, of} from "rxjs";
import {ToastService} from "../../../shared-comp/toast/toast.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-delete',
  standalone: true,
  template: `
    <div class="w-full mb-2 px-2.5 text-center">
      <h1 class="cx-font-size">Are you sure you want to delete {{ data.name }}?</h1>
    </div>

    <div class="p-2.5 px-1.5 flex justify-between">
      <button mat-stroked-button color="warn" [style.border-color]="'red'" type="button" (click)="cancel()">
        Cancel
      </button>
      <button
        type="button"
        class="capitalize text-white font-bold py-2 px-4 rounded bg-[var(--app-theme-hover)]"
        [asyncButton]="delete()"
      >delete</button>
    </div>
  `,
  imports: [CommonModule, MatDialogModule, MatButtonModule, DirectiveModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteComponent {

  private readonly toastService = inject(ToastService);

  constructor(
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteData<{ status: number, message: string }>,
  ) { }

  /** Emits false if a user wants delete */
  cancel(): void {
    this.dialogRef.close();
  }

  /** Emits true if a user wants delete */
  delete(): Observable<number> {
    return this.data.asyncButton.pipe(
      map((obj: { status: number, message: string }) => {
        this.toastService.toastMessage(obj.message);
        this.cancel();
        return obj.status;
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        this.cancel();
        return of(err.status);
      })
    );
  }

}
