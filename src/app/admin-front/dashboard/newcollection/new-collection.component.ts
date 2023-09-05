import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCollectionService} from "./new-collection.service";
import {map, Observable, of, switchMap} from "rxjs";
import {CollectionRequest, CollectionResponse} from "../../shared-util";
import {DirectiveModule} from "../../../directive/directive.module";
import {CollectionService} from "../collection/collection.service";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionComponent {

  private service: NewCollectionService = inject(NewCollectionService);
  private collectionService: CollectionService = inject(CollectionService);

  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, Validators.required)
  });

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.reset();
  }

  /**
   * Submit reactive form to our server.
   * The gotcha is on successful creation, we switch map to update collection array
   * @return Observable of type number
   * */
  submit(): Observable<number> {
    const obj: CollectionRequest = {
      name: this.reactiveForm.get('name')?.value,
      visible: this.reactiveForm.get('visible')?.value
    };

    return this.service.create(obj).pipe(
      switchMap((res: number): Observable<number> => {
        if (res >= 200 && res < 300) {
          this.clear();
          return this.collectionService.fetchCollections().pipe(
            map((arr: CollectionResponse[]) => {
              this.collectionService.setCollections(arr);
              return res;
            })
          );
        }
        return of(res);
      })
    );
  }

}
