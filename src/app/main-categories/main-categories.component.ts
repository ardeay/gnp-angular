import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

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
  imports: [AsyncPipe, NgIf, NgFor, RouterLink],
  templateUrl: './main-categories.component.html'
})
export class MainCategoriesComponent {
  readonly endpoint =
    `${environment.zesty_stage_cms}/-/instant/6-a09881cd9b-zrhzr9.json?zpw=${environment.zesty_stage_pw}`;
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
