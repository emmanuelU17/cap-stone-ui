import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewCollectionService} from "./new-collection.service";
import {Observable, tap} from "rxjs";
import {CollectionRequest} from "../../shared-util";
import {DirectiveModule} from "../../../directive/directive.module";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, DirectiveModule],
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionComponent {
  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.max(50)]),
    visible: new FormControl(false, Validators.required)
  });

  constructor(private service: NewCollectionService) { }

  /** Clears reactiveForm */
  clear(): void {
    this.reactiveForm.reset();
  }

  submit(): Observable<number> {
    const obj: CollectionRequest = {
      name: this.reactiveForm.get('name')?.value,
      visible: this.reactiveForm.get('visible')?.value
    };

    return this.service.create(obj).pipe(
      tap((res: number): void => {
        if (res >= 200 && res < 300) {
          this.clear();
        }
      })
    );
  }

}
