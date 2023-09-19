import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CustomUpdateVariant, UpdateVariant} from "./update-variant";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of, switchMap, tap} from "rxjs";
import {UpdateVariantService} from "./update-variant.service";
import {ProductService} from "../product/product.service";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatRadioModule} from "@angular/material/radio";

@Component({
  selector: 'app-update-variant',
  templateUrl: './update-variant.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, DirectiveModule, MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateVariantComponent {

  form: FormGroup;

  constructor(
    private updateVariantService: UpdateVariantService,
    private productService: ProductService,
    private fb: FormBuilder,
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
    this.dialogRef.close();
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
          const res = of(status);

          // Error
          if (!(status >= 200 && status < 300)) {
            return res;
          }

          return this.productService.fetchProductDetails(this.data.productId)
            // refresh variants table and close the modal
            .pipe(
              switchMap(() => res),
              tap(() => this.onNoClick())
            )
        })
      );
  }

}
