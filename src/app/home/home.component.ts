import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MainCategoriesComponent } from '../main-categories/main-categories.component';

interface HomePageResponse {
  title?: string;
  meta?: {
    model_name?: string;
    model_alternate_name?: string;
    zuid?: string;
    createdAt?: string;
    updatedAt?: string;
    locale?: {
      name?: string;
      code?: string;
      url?: string;
    };
    model?: {
      label?: string;
      resourceURI?: string;
    };
    availableLocales?: Array<{
      name?: string;
      code?: string;
      url?: string;
      default?: string;
    }>;
    web?: {
      url?: string;
      uri?: string;
      fragment?: string;
      seo_meta_title?: string;
      seo_meta_description?: string;
      sitemap_last_updated?: string;
    };
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, MainCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly endpoint =
    'https://l2z974n0-dev.webengine.zesty.io/?toJSON&zpw=gnpmx';
  readonly data$ = this.http.get<HomePageResponse>(this.endpoint).pipe(
    catchError(() => {
      this.errorMessage =
        'Unable to load homepage data right now. Please try again later.';
      return of(null);
    })
  );
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}
}
