import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

// Component where Admin profile will be displayed
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
})
export class AdminComponent { }
