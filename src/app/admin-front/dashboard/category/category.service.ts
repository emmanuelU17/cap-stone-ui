import {Injectable} from '@angular/core';
import {CategoryResponse} from "../../shared-util";
import {map, Observable, of} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  HOST: string | undefined;

  _categories$: Observable<CategoryResponse[]> = of();
  categories: CategoryResponse[] = [];

  constructor(private http: HttpClient) {
    this.HOST = environment.domain;
  }

  // Fetch Categories
  fetchCategories(): Observable<CategoryResponse[]> {
    const url = `${this.HOST}api/v1/worker/category`
    return this.http.get<CategoryResponse[]>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<CategoryResponse[]>) => {
        const body = res.body;
        if (!body) {
          return [];
        }
        this.categories = body;
        this._categories$ = of(body);
        return body;
      })
    );
  }

}
