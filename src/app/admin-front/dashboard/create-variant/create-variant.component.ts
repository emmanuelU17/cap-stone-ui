import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {SizeInventoryComponent} from "../sizeinventory/size-inventory.component";
import {SizeInventory} from "../../shared-util";
import {DirectiveModule} from "../../../directive/directive.module";
import {catchError, Observable, of, tap} from "rxjs";
import {CreateVariantService} from "./create-variant.service";
import {ToastService} from "../../../service/toast/toast.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CreateVariantData} from "./createVariantData";
import {HelperService} from "../../helper.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-create-variant',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    SizeInventoryComponent,
    DirectiveModule
  ],
  templateUrl: './create-variant.component.html',
})
export class CreateVariantComponent {
  protected readonly URL = URL;

  private readonly createVariantService: CreateVariantService = inject(CreateVariantService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly helperService: HelperService = inject(HelperService);

  files: File[] = []; // Images
  rows: SizeInventory[] = [];

  filesIsEmpty = this.files.length > 0

  reactiveForm = this.fb.group({
    visible: new FormControl(false, Validators.required),
    colour: new FormControl('', Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateVariantComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateVariantData
  ) { }


  /**
   * Removes image clicked
   * @param file
   * @return void
   * */
  remove(file: File): void {
    const index: number = this.files.findIndex((value: File) => value.name === file.name);
    this.files.splice(index, 1);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.files.push(file);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /** Clears reactiveForm */
  clear(): void {
    this.files = [];
    this.reactiveForm.reset();
  }

  /** Sets Size and Inventory to FormGroup */
  sizeInv(arr: SizeInventory[]): void {
    this.rows = arr;
  }

  create(): Observable<number> {
    const data: FormData = this.helperService
      .toFormData(this.reactiveForm, this.files, this.rows);
    data.append('id', this.data.id);
    // TODO Refresh ProductVariant table on successful creation
    return this.createVariantService.create(data)
      .pipe(
        tap(() => {
          this.toastService.toastMessage('Created!');
          this.cancel();
          this.clear();
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error.message);
          return of(err.status);
        })
      );
  }

}
