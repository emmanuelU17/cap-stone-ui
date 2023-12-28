import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./collection-impl/collection-impl.component').then(m => m.CollectionImplComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new-collection.component').then(m => m.NewCollectionComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./update/update-collection.component').then(m => m.UpdateCollectionComponent),
  }
]
