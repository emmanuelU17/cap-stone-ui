import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-store-front-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  template: `
    <div class="lg-scr mg-top p-20 flex justify-center items-center">
      @switch (template) {
        <!-- login template -->
        @case ('login') {
          <app-login (emitter)="templateToDisplay($event)"></app-login>
        }
        <!-- register template -->
        @default {
          <app-register (emitter)="templateToDisplay($event)"></app-register>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreFrontAuthComponent {
  template = 'login';

  /**
   * Display register or login component
   * */
  templateToDisplay(event: string): void {
    this.template = event;
  }
}
