import { isPlatformServer } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LightboxService } from '../../services/lightbox.service';

@Component({
  selector: 'preptm-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  fallback = 'assets/img/placeholder.svg';
  originalUrl = 'assets/img/placeholder.svg';
  srcHigh = 'assets/img/placeholder.svg';
  srcMedium = 'assets/img/placeholder.svg';
  srcLow = 'assets/img/placeholder.svg';
  srcWidth = 0;
  hasError = false;
  private _isServer = false;
  @Input() showPreview = false;
  @Input() alt = '';
  @Input() onlyLow = false
  @Input() onlyMedium = false
  @Input() className = ''
  @Input() skipSmall = false

  @Input() set src(url: string) {
    if (url) {
      this.hasError = false;
      const resolvedUrl = url.includes('http') ? url : `${environment.fileBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      let ext = resolvedUrl.split('.').pop();
      this.originalUrl = resolvedUrl;
      this.srcHigh = resolvedUrl.replaceAll('OriginalAttachment', 'Th1200x628').replaceAll(`.${ext}`, '.png');
      this.srcMedium = resolvedUrl.replaceAll('OriginalAttachment', 'Th360x180').replaceAll(`.${ext}`, '.png');
      this.srcLow = resolvedUrl.replaceAll('OriginalAttachment', 'Th360x180').replaceAll(`.${ext}`, '.png');
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.calculateScreenWidth();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private lightbox: LightboxService
  ) {
    this._isServer = isPlatformServer(this.platformId);
    this.calculateScreenWidth();
  }

  calculateScreenWidth() {
    if (!this._isServer) {
      this.srcWidth = window.innerWidth;
    }
  }

  ngOnInit(): void {
    this.fallback = this.fallback;
  }

  onError(event: Event) {
    this.hasError = true;
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.fallback) {
      img.src = this.fallback;
    }
  }

  openPreview(alt = '') {
    if (this.showPreview && !this.hasError) {
      this.lightbox.open([{ src: this.originalUrl, alt }]);
    }
  }
}
