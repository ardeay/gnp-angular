import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GnpButtonComponent } from '../shared/gnp-button/gnp-button.component';
import { BlockComponent } from '../shared/block/block.component';

interface PageCategory {
  name?: string;
  parent_category?: {
    data?: Array<{
      name?: string;
    }>;
  };
}

interface PageImage {
  url?: string;
}

export interface PageData {
  title?: string;
  content?: string;
  primary_button___boton_primario?: string;
  secondary_button___boton_secundario?: string;
  primary_ad___aununcio_primario?: string;
  secondary_ad___anuncio_secundario?: string;
  category?: {
    data?: PageCategory[];
  };
  main_image?: {
    data?: PageImage[];
  };
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, GnpButtonComponent, BlockComponent],
  templateUrl: './pages.component.html'
})
export class PagesComponent {
  @Input({ required: true }) page: PageData | null = null;
}
