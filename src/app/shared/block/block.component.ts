import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-block',
  standalone: true,
  imports: [NgIf],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss'
})
export class BlockComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) name = '';
  @Input() baseUrl = `${environment.zesty_stage_cms.replace(/\/$/, '')}`;
  @Input() password = 'gnpmx';
  @Input() variant = '';
  @Input() version = '';
  @Input() trustHtml = true;

  html: SafeHtml | string | null = null;
  errorMessage: string | null = null;

  private loadSub?: Subscription;
  private hasLoaded = false;

  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadHtml('init');
  }

  ngOnChanges(): void {
    this.loadHtml('changes');
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
  }

  private loadHtml(trigger: 'init' | 'changes'): void {
    if (this.hasLoaded && trigger === 'init') {
      return;
    }

    if (!this.name) {
      this.html = null;
      this.errorMessage = 'No block name provided.';
      return;
    }

    const trimmedName = this.name.trim();
    const [basePath, baseQuery = ''] = this.baseUrl.split('?');
    const params = new URLSearchParams(baseQuery);
    if (this.password) {
      params.set('zpw', this.password);
    }
    if (this.variant) {
      params.set('variant', this.variant);
    }
    if (this.version) {
      params.set('version', this.version);
    }

    const query = params.toString();
    const url = `${basePath.replace(/\/$/, '')}${trimmedName}${
      query ? `&${query}` : ''
    }`;

    this.errorMessage = null;
    this.loadSub?.unsubscribe();
    this.loadSub = this.http
      .get(url, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.errorMessage = 'Unable to load the block markup right now.';
          return of('');
        })
      )
      .subscribe((markup) => {
        if (!markup) {
          this.html = null;
          return;
        }

        this.hasLoaded = true;
        this.html = this.trustHtml
          ? this.sanitizer.bypassSecurityTrustHtml(markup)
          : markup;
      });
  }
}
