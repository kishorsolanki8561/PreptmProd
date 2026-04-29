import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
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
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformServer(this.platformId)) {
      try {
        (adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
      }
    }
  }

}
