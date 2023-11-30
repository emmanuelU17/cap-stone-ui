import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SarreCurrency} from "../../../global-utils";
import {FooterService} from "./footer.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="p-3 border-t border-solid bg-[var(--app-theme)]">
        <div class="flex items-center justify-between">
          <h1 class="f-font m-0">
            &copy; [{{ year }}] Sarre The Brand |  Powered by
            <a
              class="m-0 border-b border-black text-[var(--black)]"
              href="https://emmanueluluabuike.com/"
              target="_blank"
            >E.U</a>
          </h1>

          <select class="f-font p-2 cursor-pointer" (change)="setCurrency($event)">
            <option *ngFor="let currency of currencies" [value]="currency" class="uppercase cursor-pointer">
              {{ currency }}
            </option>
          </select>
        </div>
      </div>
  `,
  styles: [`
      .f-font {
          font-size: 15px;
      }

      @media (max-width: 768px) {
          .f-font {
              font-size: calc(7px + 1vw);
          }
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  year = new Date().getFullYear();
  currencies: SarreCurrency[] = [SarreCurrency.NGN, SarreCurrency.USD];

  private readonly footerService = inject(FooterService);

  setCurrency(event: Event): void {
    const currency = ((event.target as HTMLSelectElement).value) as SarreCurrency;
    this.footerService.activeCurrency(currency);
  }

}
