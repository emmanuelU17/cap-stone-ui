import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {SizeInventory} from "./shared-util";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  /** Responsible for converting from FormGroup to FormData */
  toFormData(formGroup: FormGroup, files: File[], rows: SizeInventory[]): FormData {
    const formData: FormData = new FormData();
    for (const key in formGroup.controls) {
      if (key !== 'files' && key !== 'sizeInventory') {
        formData.append(key, formGroup.controls[key].value);
      }
    }
    files.forEach((file: File) => formData.append('files', file));
    rows.forEach((row: SizeInventory) => formData.append('sizeInventory', JSON.stringify(row)));
    return formData;
  }

}
