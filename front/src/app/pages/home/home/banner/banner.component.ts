import { Component, OnInit } from '@angular/core';
import { BannerListModel } from 'src/app/core/models/Banner.model';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'preptm-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  isLoading = true;
  banners: BannerListModel[];
  constructor(private readonly _searchService: SearchService) {
  }
  ngOnInit(): void {
    this.GetBanners();
  }

  GetBanners() {
    this._searchService.GetBanners().subscribe(res => {
      this.isLoading = false
      if (res.isSuccess) {
        this.banners = res.data;
      } else {
      }
    })
  }
}
