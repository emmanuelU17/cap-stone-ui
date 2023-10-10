import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly arr: string[] = [
    'assets/image/sarre1.jpg',
    'assets/image/sarre2.jpg',
    'assets/image/sarre3.jpg',
  ]

  get getImages(): string[] {
    return this.arr;
  }

}
