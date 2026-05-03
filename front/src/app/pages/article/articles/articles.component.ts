import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
export class ArticlesComponent implements OnDestroy {

  private destroy$ = new Subject<void>();
  private _isServer = false;
  isMobile = true;
  typeSlug = ''
  articleTypeList: ddlItem[] = []
  // ddls: ddl | undefined;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
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

    this._route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.getArticles();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getArticles() {
    this._coreService.GetDDLLookupData(DdlLookupSlug.Article, '', ``).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
