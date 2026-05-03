import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoreModule } from 'src/app/core/core.module';
import { DATE_FORMAT, PreptmLogo } from 'src/app/core/fixed-values';
import { Breadcrumb } from 'src/app/core/models/core.models';
import { ArticleDetails, Post, PostListFilter } from 'src/app/core/models/post.model';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-article',
  templateUrl: './article-details.component.html',
  standalone: true,
  imports: [CoreModule, CommonModule],
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  post: ArticleDetails | undefined;
  breadcrumb: Breadcrumb[] = [];
  latestList: Post[] = [];
  postListFilter: PostListFilter = new PostListFilter();
  slug = ''
  DATE_FORMAT = DATE_FORMAT
  shortDesc: string[] = []
  preptmLogo = PreptmLogo
  lang: string;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _coreService: CoreService,
    private renderer: Renderer2,
    public platformLocation: PlatformLocation,
  ) {
    this.lang = this._coreService.getCurrentLang()
    this._route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.slug = params['articleSlug']
      this.getArticleDetail(this.slug);
    })

  }


  ngOnInit(): void {
    this.GetLatestPost()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getArticleDetail(slug: string) {
    this.post = undefined;
    this._postService.getArticleDetails(slug).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.isSuccess) {

        this.post = res.data
        this.shortDesc = res.data.summary?.split('\n')
        this.breadcrumb = [
          { text: 'Article', path: '../../' },
          { text: this._coreService.titleCase(res.otherData?.moduleText), path: '../' },
          { text: this.post.title }
        ]
        this.addMetaTags(this.post)
      } else {
        this.post = undefined
      }
    })
  }


  addMetaTags(blockContaintDetails: ArticleDetails) {
    let tags: MetaDefinition[] = [];

    tags.push({
      property: 'og:type',
      content: "article"
    })

    tags.push({
      property: 'description',
      content: this.shortDesc[0] || blockContaintDetails.title
    })
    tags.push({
      property: 'og:description',
      content: this.shortDesc[0] || blockContaintDetails.title
    })

    if (blockContaintDetails.title) {
      this._coreService.setPageTitle(blockContaintDetails.title)
      tags.push({
        property: 'og:title',
        content: blockContaintDetails.title
      })
    }

    if (blockContaintDetails.thumbnail) {
      tags.push({
        property: 'og:image',
        content: blockContaintDetails.thumbnail
      })

      tags.push({
        property: 'og:image:alt',
        content: blockContaintDetails.title
      })
    }

    if (blockContaintDetails.keywords) {
      tags.push({
        property: 'keywords',
        content: blockContaintDetails.keywords
      })
    }
    this._coreService.manageMetaTags(tags, this.renderer);
  }


  GetLatestPost() {
    this.postListFilter.orderBy = 'latest';
    this.postListFilter.pageSize = 5;
    this.postListFilter.orderByAsc = 0;
    this.getList({ ...this.postListFilter }, 'latest');
  }


  getList(payload: PostListFilter, Type: string = '') {
    this._postService.getPostLists(payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.isSuccess) {
        if (Type == 'latest') {
          this.latestList = res.data ?? [];
          //TODO: remove same post only
          // if (this.latestList) {
          //   this.latestList = this.latestList.filter(s => s.slugUrl != this.post?.slugUrl);
          // }
        }
      } else {
        this.latestList = []

      }
    })
  }

}
