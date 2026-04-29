import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { API_ROUTES } from 'src/app/core/api.routes';
import { DdlLookupSlug } from 'src/app/core/fixed-values';
import { ddl, ddlItem } from 'src/app/core/models/core.models';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {

  private _isServer = false;
  isMobile = true;
  typeSlug = ''
  articleTypeList: ddlItem[] = []
  // ddls: ddl | undefined;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('IS_MOBILE') private isMobileReq: any,
    private _coreService: CoreService
  ) {
    this._isServer = isPlatformServer(this.platformId);

  }
  colors: string[] = ['#fff5e5', '#f5f5ff', '#ffe5e5', '#e5ffef'];



  getColor(index: number): string {
    // Reuse colors cyclically
    return this.colors[index % this.colors.length];
  }


  ngOnInit(): void {

    this._route.params.subscribe((params: Params) => {
      this.getArticles();
    })
  }

  getArticles() {
    this._coreService.GetDDLLookupData(DdlLookupSlug.Article, '', ``).subscribe((res) => {
      if (res.isSuccess) {
        this.articleTypeList = res.data[DdlLookupSlug.Article]
      } else {
        this.articleTypeList = []
      }
    }, (err) => {
      this.articleTypeList = []
    })
  }
}
