import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-gnp-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './gnp-button.component.html',
  styleUrl: './gnp-button.component.scss'
})
export class GnpButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() src = 'https://l2z974n0-dev.webengine.zesty.io/-/block/gnp_button.html?zpw=gnpmx';
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

    if (!this.src) {
      this.html = null;
      this.errorMessage = 'No source URL provided for the GNP button.';
      return;
    }

    this.errorMessage = null;
    this.loadSub?.unsubscribe();
    this.loadSub = this.http
      .get(this.src, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.errorMessage =
            'Unable to load the GNP button markup right now.';
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
