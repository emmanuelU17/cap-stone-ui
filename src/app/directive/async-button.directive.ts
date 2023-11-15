import {DestroyRef, Directive, ElementRef, HostListener, inject, Input} from '@angular/core';
import {Observable, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[asyncButton]'
})
export class AsyncButtonDirective {

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly el: ElementRef = inject(ElementRef);

  @Input('asyncButton') clickFunc!: Observable<unknown>;

  @HostListener('click', ['$event']) onClick(): void {
    const spinner = `
        <div role="status" class="
             inline-block
             h-8 w-8
             animate-spin
             rounded-full
             border-4 border-solid border-r-[var(--app-theme)]
             align-[-0.125em]
             text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]
             "
        >
         <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
    `

    const prevElement = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = spinner;
    this.el.nativeElement.disabled = true;

    this.clickFunc.pipe(
      tap({
        next: () => {
          this.el.nativeElement.innerHTML = prevElement;
          this.el.nativeElement.disabled = false;
        },
        error: () => {
          this.el.nativeElement.innerHTML = prevElement;
          this.el.nativeElement.disabled = false;
        },
        complete: () => {
          this.el.nativeElement.innerHTML = prevElement;
          this.el.nativeElement.disabled = false;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
