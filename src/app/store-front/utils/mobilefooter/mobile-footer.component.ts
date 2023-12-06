import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-mobile-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex flex-col">
      <!-- info -->
      <div class="w-full p-2 border-b">
        <button (click)="infoBtn = !infoBtn" type="button" class="w-full flex justify-between">
          <h2 class="uppercase text-base font-bold">legal</h2>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
        </button>

        <ul class="list-none" [style]="{ 'display': infoBtn ? 'block' : 'none'}">
          <li class="py-2 text-sm"><a (click)="route('/pages/about-us')"  class="cursor-pointer">About Us</a></li>
          <li class="py-2 text-sm"><a (click)="route('/pages/terms-of-service')"  class="cursor-pointer">Terms of Service</a></li>
          <li class="py-2 text-sm"><a (click)="route('/pages/refund')"  class="cursor-pointer">Refund Policy</a></li>
        </ul>
      </div>

      <!-- help -->
      <div class="w-full p-2 border-b">
        <button (click)="helpBtn = !helpBtn" type="button" class="w-full flex justify-between">
          <h2 class="uppercase text-base font-bold">help</h2>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
        </button>

        <ul class="list-none" [style]="{ 'display': helpBtn ? 'block' : 'none'}">
          <li class="py-2 text-sm"><a (click)="route('/pages/faq')" class="cursor-pointer">FAQ</a></li>
          <li class="py-2 text-sm"><a (click)="route('/pages/contact-us')" class="cursor-pointer">Contact Us</a></li>
        </ul>
      </div>

      <!-- socials -->
      <div class="w-full p-2">
        <h2 class="uppercase text-base font-bold">follow us</h2>
        <ul class="list-none">
          <!-- instagram -->
          <li class="py-2 text-sm">
            <a class="cursor-pointer" href="https://www.instagram.com/sarrethebrand/" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="currentColor"
                style="color: #c13584"
                viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </li>

        </ul>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileFooterComponent {

  infoBtn = false;
  helpBtn = false;

  @Output() emitter = new EventEmitter<string>();

  route(str: string): void {
    this.emitter.emit(str);
  }

}
