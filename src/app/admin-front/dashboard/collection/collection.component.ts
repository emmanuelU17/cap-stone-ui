import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionResponse, TableContent} from "../../shared-util";
import {CollectionService} from "./collection.service";
import {Observable} from "rxjs";
import {DynamicTableComponent} from "../dynamictable/dynamic-table.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent {
  private collectionService: CollectionService = inject(CollectionService);
  private router: Router = inject(Router);

  data$: Observable<CollectionResponse[]> = this.collectionService._collections$;
  columns: Array<keyof CollectionResponse> = ['id', 'collection', 'created_at', 'modified_at', 'visible', 'action'];

  /** Based on the key received from DynamicTableComponent, route to the appropriate page */
  infoFromTableComponent(content: TableContent<CollectionResponse>): void {
    switch (content.key) {
      case 'edit':
        this.router.navigate([`/admin/dashboard/collection/${content.data.id}`]);
        break;
      case 'delete':
        // TODO
        break;
      default :
        console.error('Invalid key chosen');
    }
  }

}
