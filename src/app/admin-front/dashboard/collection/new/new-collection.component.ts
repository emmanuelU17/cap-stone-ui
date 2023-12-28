import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCollectionService} from "./new-collection.service";
import {catchError, Observable, of, switchMap} from "rxjs";
import {CollectionRequest} from "../../../shared-util";
import {DirectiveModule} from "../../../../directive/directive.module";
import {CollectionService} from "../collection.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../../shared-comp/toast/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  template: `
    <form class="h-full flex flex-col py-0 px-2.5" [formGroup]="reactiveForm">
      <!-- Title -->
      <div class="py-2.5 px-0 mb-4 flex">
        <button type="button"
                class="mr-1.5 md:px-2.5 border-[var(--border-outline)] border"
                (click)="routeToCollectionComponent()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
          </svg>
        </button>
        <h1 class="cx-font-size w-fit capitalize border-b border-[var(--app-theme)]">create a new collection</h1>
      </div>

      <!-- Contents -->
      <div class="flex gap-2.5 max-[945px]:flex-col">

        <!-- Left-column -->
        <div class="flex-1">
          <div class="p-2.5 rounded-md border border-solid border-[var(--active)] bg-[var(--white)]">
            <div class="py-1.5 px-0"><h2 class="cx-font-size capitalize">general</h2></div>

            <div class="text-left">
              <div class="flex flex-col gap-2.5">
                <h4 class="cx-font-size capitalize">name <span class="border-red-600">*</span></h4>
                <input
                  formControlName="name"
                  placeholder="collection name"
                  type="text"
                  class="p-2.5 w-full flex-1 inline rounded-sm border border-solid border-[var(--border-outline)]"
                />
              </div>
            </div>
            <!-- End of content -->
          </div>
          <!-- End of mat-card left -->
        </div>

        <!-- Right-column -->
        <div class="flex-1">
          <div class="h-full p-2.5 rounded-md border border-[var(--active)] border-solid bg-[var(--white)]">
            <div class="py-1.5 px-0"><h2 class="capitalize">status</h2></div>
            <!-- End of attribute-title -->

            <div class="text-left">
              <div>
                <h4 class="cx-font-size capitalize">visibility (include in store front) <span [style]="'color: red'">*</span></h4>
                <mat-radio-group aria-label="Select an option" formControlName="visible">
                  <mat-radio-button [checked]='true' value="false">false</mat-radio-button>
                  <mat-radio-button value="true">true</mat-radio-button>
                </mat-radio-group>
              </div>
            </div>
            <!-- End of content -->
          </div>
          <!-- End of mat-card right -->
        </div>

      </div>

      <!-- Button container -->
      <div class="p-2.5 px-1.5 flex justify-between">
        <button mat-stroked-button color="warn" [style.border-color]="'red'" type="button" (click)="clear()">Cancel</button>
        <button
          type="submit"
          class="capitalize text-white font-bold py-2 px-4 rounded bg-[var(--app-theme)]"
          [disabled]="!reactiveForm.valid"
          [style]="{ 'background-color': reactiveForm.valid ? 'var(--app-theme-hover)' : 'var(--app-theme)' }"
          [asyncButton]="submit()"
        >create</button>
      </div>
      <!-- End of action-btn -->
    </form>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionComponent {

  private readonly newCollectionService = inject(NewCollectionService);
  private readonly collectionService = inject(CollectionService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  reactiveForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, Validators.required)
  });

  routeToCollectionComponent = (): void => {
    this.router.navigate(['/admin/dashboard/collection']);
  }

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.controls['name'].setValue('');
  }

  /**
   * Submit reactive form to our server.
   * The gotcha is on successful creation, we switch map to update collection array
   * @return Observable of type number
   * */
  submit(): Observable<number> {
    const name = this.reactiveForm.controls['name'].value;
    const visible = this.reactiveForm.controls['visible'].value;

    if (!name || visible === null) {
      return of();
    }

    const obj: CollectionRequest = { name: name, visible: visible };

    return this.newCollectionService.create(obj).pipe(
      switchMap((status: number): Observable<number> => {
        this.clear();
        return this.collectionService.allCollections()
          .pipe(switchMap(() => of(status)));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.toastMessage(err.error.message);
        return of(err.status);
      })
    );
  }

}
