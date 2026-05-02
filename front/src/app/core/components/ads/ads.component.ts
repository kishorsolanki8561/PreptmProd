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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngAfterViewInit(): void {
    if (!this.showAds || isPlatformServer(this.platformId)) return;
    try {
      (adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
    }
  }

}
