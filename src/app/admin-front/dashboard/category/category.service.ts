import {Injectable} from '@angular/core';
import {CategoryResponse} from "../../shared-util";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  HOST: string | undefined;

  private categories$ = new BehaviorSubject<CategoryResponse[]>([]);
  _categories$ = this.categories$.asObservable();

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  // Called on initial load of application
  setCategories(arr: CategoryResponse[]): void {
    this.categories$.next(arr);
  }

  // Fetch Categories
  fetchCategories(): Observable<CategoryResponse[]> {
    const url = `${this.HOST}api/v1/worker/category`
    return this.http.get<CategoryResponse[]>(url, { withCredentials: true });
  }

}
