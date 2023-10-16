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
  standalone: true,
  template: `
      <div class="w-full p-2 flex justify-center">
          <h1 class="cx-font-size w-fit capitalize border-b border-b-[var(--app-theme)]">editing {{ data.productName }}
              variant</h1>
      </div>

      <form class="w-full p-2 grid grid-cols-1 gap-2 bg-[var(--white)]" [formGroup]="form">

          <!-- SKU -->
          <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size">SKU <span style="color: red">*</span></h4>
              <input type="text" class="w-full bg-transparent" formControlName="sku">
          </div>

          <!-- Colour -->
          <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size capitalize">colour <span style="color: red">*</span></h4>
              <input type="text"
                     class="w-full p-2.5 bg-transparent rounded-sm border border-solid border-[var(--border-outline)]"
                     formControlName="colour">
          </div>

          <!-- Radio -->
          <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size">Visibility (include in store front) <span [style]="'color: red'">*</span></h4>
              <mat-radio-group aria-label="Select an option" formControlName="visible">
                  <mat-radio-button [value]="false" [checked]="!data.variant.is_visible">false</mat-radio-button>
                  <mat-radio-button [value]="true" [checked]="data.variant.is_visible">true</mat-radio-button>
              </mat-radio-group>
          </div>

          <!-- QTY -->
          <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size capitalize">quantity <span style="color: red">*</span></h4>
              <input
                      type="number"
                      class="p-2.5 w-full flex-1 inline rounded-sm border border-solid border-[var(--border-outline)]"
                      [value]="data.variant.qty"
                      formControlName="qty"
              >
          </div>

          <!-- SIZE -->
          <div class="p-6 text-left rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
              <h4 class="cx-font-size capitalize">size <span style="color: red">*</span></h4>
              <input
                      type="text"
                      class="p-2.5 w-full flex-1 inline rounded-sm border border-solid border-[var(--border-outline)]"
                      [value]="data.variant.size"
                      formControlName="size"
              >
          </div>

          <!-- Btn ctn -->
          <div class="flex justify-between py-2.5 px-1.5">
              <button
                      class="text-white font-bold py-2 px-4 rounded border bg-red-500"
                      type="button"
                      (click)="onNoClick()">cancel
              </button>

              <button type="submit"
                      class="text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
                      [disabled]="!form.valid"
                      [style]="{ 'background-color': form.valid ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
                      [asyncButton]="update()"
              >update
              </button>
          </div>

      </form>
  `,
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
      colour: new FormControl(this.data.variant.colour, [Validators.required]),
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
    const colour = this.form.controls['colour'].value;
    const qty = this.form.controls['qty'].value;
    const size = this.form.controls['size'].value;

    const payload: UpdateVariant = {
      sku: sku,
      colour: colour,
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
