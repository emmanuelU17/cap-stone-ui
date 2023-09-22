import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {SizeInventoryComponent} from "../sizeinventory/size-inventory.component";
import {ProductDetailResponse, SizeInventory} from "../../shared-util";
import {DirectiveModule} from "../../../directive/directive.module";
import {catchError, Observable, of, switchMap, tap} from "rxjs";
import {CreateVariantService} from "./create-variant.service";
import {ToastService} from "../../../service/toast/toast.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CreateVariantData} from "./createVariantData";
import {HelperService} from "../../helper.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UpdateProductService} from "../updateproduct/update-product.service";
import {CustomQueue} from "../sizeinventory/custom-queue";
import {SizeInventoryService} from "../sizeinventory/size-inventory.service";

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVariantComponent {

  private readonly createVariantService: CreateVariantService = inject(CreateVariantService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly helperService: HelperService = inject(HelperService);
  private readonly updateProductService: UpdateProductService = inject(UpdateProductService);
  private readonly sizeInventoryService: SizeInventoryService = inject(SizeInventoryService);

  files: File[] = []; // Images
  rows: SizeInventory[] = [];
  colourExists = true;

  // Converts file to image strings
  toString = (file: File): string => URL.createObjectURL(file);

  reactiveForm = this.fb.group({
    visible: new FormControl(true, Validators.required),
    colour: new FormControl('', Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateVariantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateVariantData
  ) {}

  /**
   * Allows for removing dummy inputs if colour exists
   * */
  oninputChange(event: KeyboardEvent): void {
    const input: string = (event.target as HTMLInputElement).value;
    const find = this.data.colours.find(c => c === input);
    if (find) {
      this.colourExists = false;
      this.files = [];
    }
  }

  /**
   * Updates reactive form if cx wants to create a new product variant with exist colour
   * */
  onselectColour(event: Event): void {
    const colour: string = (event.target as HTMLInputElement).value;
    this.reactiveForm.controls['colour'].setValue(colour);
    this.colourExists = false;
    this.files = [];
  }

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
    data.append('uuid', this.data.id);

    return this.createVariantService.create(data)
      .pipe(
        switchMap((status: number) => {
          return this.updateProductService
            .fetchProductDetails(this.data.id)
            .pipe(
              switchMap((arr: ProductDetailResponse[]) => {
                this.dialogRef.close({ arr: arr });
                this.sizeInventoryService.setSubject(true);
                return of(status);
              }),
              tap(() => this.toastService.toastMessage('Created!'))
            );
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.error.message);
          return of(err.status);
        })
      );
  }

}
