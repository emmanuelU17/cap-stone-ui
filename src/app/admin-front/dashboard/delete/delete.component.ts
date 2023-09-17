import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DeleteData} from "./delete-data";
import {DirectiveModule} from "../../../directive/directive.module";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, DirectiveModule],
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteData<number>,
  ) { }

  /** Emits false if a user wants delete */
  cancel(): void {
    this.dialogRef.close();
  }

  /** Emits true if a user wants delete */
  delete(): Observable<number> {
    return this.data.obs.pipe(tap(d => console.log('Data ', d)));
  }

}
