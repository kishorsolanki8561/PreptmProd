import { isPlatformServer } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
  private _isServer = false;
  @Input() showPreview = false;
  @Input() alt = '';
  @Input() onlyLow = false
  @Input() onlyMedium = false
  @Input() className = ''
  @Input() skipSmall = false

  @Input() set src(url: string) {
    if (url) {
      let ext = url.split('.').pop();
      this.originalUrl = url;
      this.srcHigh = url.replaceAll('OriginalAttachment', 'Th1200x628').replaceAll(`.${ext}`, '.png');
      this.srcMedium = url.replaceAll('OriginalAttachment', 'Th360x180').replaceAll(`.${ext}`, '.png');
      this.srcLow = url.replaceAll('OriginalAttachment', 'Th360x180').replaceAll(`.${ext}`, '.png');
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
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.fallback) {
      img.src = this.fallback;
    }
  }

  openPreview(alt = '') {
    if (this.showPreview) {
      this.lightbox.open([{ src: this.fallback, alt }]);
    }
  }
}
