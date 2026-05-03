import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BannerListModel } from 'src/app/core/models/Banner.model';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'preptm-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  banners: BannerListModel[] = [];
  currentIndex = 0;

  @ViewChild('track') trackRef?: ElementRef<HTMLElement>;
  private scrollHandler?: () => void;
  private rafId?: number;

  constructor(
    private readonly _searchService: SearchService,
    private readonly _zone: NgZone,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
  }

  ngOnInit(): void {
    this.GetBanners();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    queueMicrotask(() => this.attachScrollListener());
  }

  ngOnDestroy(): void {
    if (this.trackRef && this.scrollHandler) {
      this.trackRef.nativeElement.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  GetBanners() {
    this._searchService.GetBanners().subscribe(res => {
      this.isLoading = false;
      if (res.isSuccess) {
        this.banners = res.data;
        if (isPlatformBrowser(this.platformId)) {
          queueMicrotask(() => this.attachScrollListener());
        }
      }
    });
  }

  goTo(i: number) {
    if (!this.trackRef) return;
    const el = this.trackRef.nativeElement;
    const slide = el.children.item(i) as HTMLElement | null;
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }

  private attachScrollListener() {
    if (!this.trackRef || this.scrollHandler) return;
    const el = this.trackRef.nativeElement;
    this._zone.runOutsideAngular(() => {
      this.scrollHandler = () => {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          const slideWidth = el.clientWidth;
          if (!slideWidth) return;
          const idx = Math.round(el.scrollLeft / slideWidth);
          if (idx !== this.currentIndex) {
            this._zone.run(() => this.currentIndex = idx);
          }
        });
      };
      el.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }
}
