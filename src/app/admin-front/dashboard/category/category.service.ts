import {inject, Injectable} from '@angular/core';
import {CategoryResponse} from "../../shared-util";
import {BehaviorSubject, map, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly HOST: string | undefined = environment.domain;
  private readonly http = inject(HttpClient);

  private readonly  subject$ = new BehaviorSubject<CategoryResponse[]>([]);
   readonly categories$ = this.subject$.asObservable();
  categories: CategoryResponse[] = [];

  /**
   * Delete category based on id
   * */
  deleteCategory(id: number): Observable<number> {
    const url = `${this.HOST}api/v1/worker/category/${id}`;
    return this.http.delete<HttpResponse<any>>(url,{
      observe: 'response',
      withCredentials: true
    }).pipe(map((res: HttpResponse<any>) => res.status));
  }

  /**
   * Fetch all Categories
   * */
  allCategories(): Observable<CategoryResponse[]> {
    const url = `${this.HOST}api/v1/worker/category`
    return this.http.get<CategoryResponse[]>(url, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<CategoryResponse[]>) => {
        const body = res.body;
        if (!body) {
          const arr: CategoryResponse[] = []
          return arr;
        }

        this.categories = body;
        this.subject$.next(body);
        return body;
      })
    );
  }

}
