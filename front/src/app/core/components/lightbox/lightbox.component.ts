import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { LightboxService, LightboxState } from '../../services/lightbox.service';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

@Component({
  selector: 'preptm-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxComponent implements OnInit, OnDestroy {
  state: LightboxState | null = null;
  zoom = 1;
  rotation = 0;

  private sub?: Subscription;
  private prevOverflow?: string;
  private readonly isBrowser: boolean;

  constructor(
    private lightbox: LightboxService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.sub = this.lightbox.state$.subscribe(s => {
      this.state = s;
      this.zoom = 1;
      this.rotation = 0;
      this.toggleBodyScroll(!!s);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.toggleBodyScroll(false);
  }

  close() { this.lightbox.close(); }
  next() { this.lightbox.next(); }
  prev() { this.lightbox.prev(); }

  zoomIn() {
    this.zoom = Math.min(MAX_ZOOM, +(this.zoom + ZOOM_STEP).toFixed(2));
    this.cdr.markForCheck();
  }

  zoomOut() {
    this.zoom = Math.max(MIN_ZOOM, +(this.zoom - ZOOM_STEP).toFixed(2));
    this.cdr.markForCheck();
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360;
    this.cdr.markForCheck();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('lb-overlay')) {
      this.close();
    }
  }

  get currentImage() {
    if (!this.state) return null;
    return this.state.images[this.state.index];
  }

  get hasMultiple() {
    return !!this.state && this.state.images.length > 1;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.state) return;
    switch (event.key) {
      case 'Escape': event.preventDefault(); this.close(); break;
      case 'ArrowRight': if (this.hasMultiple) { event.preventDefault(); this.next(); } break;
      case 'ArrowLeft':  if (this.hasMultiple) { event.preventDefault(); this.prev(); } break;
      case '+': case '=': event.preventDefault(); this.zoomIn(); break;
      case '-': case '_': event.preventDefault(); this.zoomOut(); break;
    }
  }

  private toggleBodyScroll(lock: boolean) {
    if (!this.isBrowser) return;
    const body = document.body;
    if (lock) {
      this.prevOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = this.prevOverflow ?? '';
    }
  }
}
