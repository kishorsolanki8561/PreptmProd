import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var adsbygoogle: any[];

@Component({
  selector: 'preptm-ads',
  host: { ngSkipHydration: 'true' },
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements AfterViewInit {
  @Input() isHeader = false
  @Input() isSidebar = false
  @Input() isArticle = false
  showAds = environment.showAds;

  private static scriptLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngAfterViewInit(): void {
    if (!this.showAds || isPlatformServer(this.platformId)) return;

    if (!AdsComponent.scriptLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2333639821213975';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      AdsComponent.scriptLoaded = true;
    }

    try {
      (adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
    }
  }

}
