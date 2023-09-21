import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CustomUpdateVariant, UpdateVariant} from "./update-variant";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, Observable, of, switchMap, tap} from "rxjs";
import {UpdateVariantService} from "./update-variant.service";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatRadioModule} from "@angular/material/radio";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../service/toast/toast.service";
import {UpdateProductService} from "../updateproduct/update-product.service";
import {ProductDetailResponse} from "../../shared-util";

@Component({
  selector: 'app-update-variant',
  templateUrl: './update-variant.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, DirectiveModule, MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateVariantComponent {

  private readonly updateVariantService: UpdateVariantService = inject(UpdateVariantService);
  private readonly updateProductService: UpdateProductService = inject(UpdateProductService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateVariantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomUpdateVariant,
  ) {
    this.form = this.fb.group({
      sku: new FormControl({value: this.data.variant.sku, disabled: true}, [Validators.required]),
      visible: new FormControl(this.data.variant.is_visible, [Validators.required]),
      qty: new FormControl(this.data.variant.qty, Validators.required),
      size: new FormControl(this.data.variant.size, [Validators.required]),
    });
  }

  /** Closes modal */
  onNoClick(): void {
    this.dialogRef.close({ arr: [] });
  }

  /** Update ProductVariant */
  update(): Observable<number> {
    const sku = this.form.controls['sku'].value;
    const visible = this.form.controls['visible'].value;
    const qty = this.form.controls['qty'].value;
    const size = this.form.controls['size'].value;

    const payload: UpdateVariant = {
      sku: sku,
      is_visible: visible,
      qty: qty,
      size: size
    }

    return this.updateVariantService.updateVariant(payload)
      .pipe(
        switchMap((status: number) => {
          // refresh variants table and close the modal
          return this.updateProductService
            .fetchProductDetails(this.data.productId)
            .pipe(
              tap((arr: ProductDetailResponse[]) => this.dialogRef.close({ arr: arr })),
              switchMap(() => of(status)),
            )
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.toastMessage(err.message);
          return of(err.status);
        })
      );
  }

}
