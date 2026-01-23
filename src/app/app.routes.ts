import { Routes } from '@angular/router';
import { DynamicPageComponent } from './dynamicpage/dynamicpage.component';
import { HomeComponent } from './home/home.component';
import { SitemapComponent } from './sitemap/sitemap.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: ':segment',
    component: DynamicPageComponent
  },
  {
    path: ':segment/:segment2',
    component: DynamicPageComponent
  }
];
