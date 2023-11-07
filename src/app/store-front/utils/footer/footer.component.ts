import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SarreCurrency} from "../../../global-utils";
import {FooterService} from "./footer.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="p-3 border-t border-solid bg-[var(--nav-mobile)]">
        <div class="flex items-center justify-between">
          <h1 class="">&copy; [{{year}}] Sarre The Brand - All rights reserved.</h1>

          <select class="p-2 cursor-pointer" (change)="setCurrency($event)">
            <option class="uppercase cursor-pointer"
                    *ngFor="let currency of currencies"
                    [value]="currency"
            >{{ currency }}</option>
          </select>
        </div>

<!--        <div class="p-2">-->
<!--          <h1>-->
<!--            Powered by-->
<!--            <a-->
<!--              class="m-0 border-b border-black text-[var(&#45;&#45;black)]"-->
<!--              href="https://emmanueluluabuike.com/"-->
<!--              target="_blank"-->
<!--            >E.U</a>-->
<!--          </h1>-->
<!--        </div>-->
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  year: number = new Date().getFullYear();
  currencies: SarreCurrency[] = [SarreCurrency.NGN, SarreCurrency.USD];

  private readonly footerService = inject(FooterService);

  setCurrency(event: Event): void {
    const currency = ((event.target as HTMLSelectElement).value) as SarreCurrency;
    this.footerService.activeCurrency(currency);
  }

}
