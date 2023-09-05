import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionResponse, TableContent} from "../../shared-util";
import {CollectionService} from "./collection.service";
import {Observable} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  private collectionService: CollectionService = inject(CollectionService)

  data$: Observable<CollectionResponse[]> = this.collectionService._collections$;
  columns: Array<keyof CollectionResponse> = ['collection', 'created_at', 'modified_at', 'visible', 'action'];

  infoFromTableComponent(content: TableContent<CollectionResponse>): void {
    console.log('Content ', content);
  }
}
