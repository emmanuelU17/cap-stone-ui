import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicTableComponent} from "../util/dynamictable/dynamic-table.component";
import {RouterOutlet} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, MatDialogModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {}
