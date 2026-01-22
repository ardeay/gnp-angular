import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';

interface CategoryResponse {
  meta?: {
    totalItems?: number;
    model?: {
      label?: string;
    };
  };
  data?: CategoryItem[];
}

interface CategoryItem {
  meta?: {
    zuid?: string;
  };
  content?: {
    name?: string;
    seo_meta_title?: string;
    seo_meta_description?: string | null;
    path_full?: string;
    language?: string;
  };
}

@Component({
  selector: 'app-main-categories',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  templateUrl: './main-categories.component.html'
})
export class MainCategoriesComponent {
  readonly endpoint =
    'https://l2z974n0-dev.webengine.zesty.io/-/instant/6-a09881cd9b-zrhzr9.json?zpw=gnpmx';
  readonly categories$ = this.http.get<CategoryResponse>(this.endpoint).pipe(
    catchError(() => {
      this.errorMessage =
        'Unable to load categories right now. Please try again later.';
      return of(null);
    })
  );
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}
}
