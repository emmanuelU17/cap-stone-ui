import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DeleteData} from "./delete-data";
import {DirectiveModule} from "../../../directive/directive.module";
import {map, Observable} from "rxjs";
import {ToastService} from "../../../service/toast/toast.service";

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, DirectiveModule],
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteComponent {
  private toastService: ToastService = inject(ToastService);

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
        return obj.status;
      })
    );
  }

}
