import { PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DATE_FORMAT, ExamModeEnum, PreptmLogo } from 'src/app/core/fixed-values';
import { Breadcrumb, ShareContent } from 'src/app/core/models/core.models';
import { AdmissionDetails, Post, PostListFilter } from 'src/app/core/models/post.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-admission-details',
  templateUrl: './admission-details.component.html',
  styleUrls: ['./admission-details.component.scss']
})
export class AdmissionDetailsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  isMobile = true
  isLoading = false
  private _isServer = false;
  preptmLogo = PreptmLogo

  post: AdmissionDetails | undefined;
  slug: string;
  DATE_FORMAT = DATE_FORMAT
  ExamModeEnum = ExamModeEnum

  breadcrumb: Breadcrumb[] = []

  isBookmarkLoading = false;
  shareContent: ShareContent;
  postListFilter: PostListFilter = new PostListFilter();
  upcommingList: Post[] = [];
  latestList: Post[] = [];
  expiredList: Post[] = [];
  shortDesc: string[] = []
  lang: string;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _coreService: CoreService,
    private _alert: AlertService,
    private renderer: Renderer2,
    public platformLocation: PlatformLocation,

  ) {
    this.lang = this._coreService.getCurrentLang()
    this._route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.slug = params['slug'];
      this.getDetails()
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDetails() {
    this.isLoading = true
    this.post = undefined;
    this._postService.getAdmissionDetails(this.slug).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        this.post = res.data
        this.shortDesc = res.data.shortDesription?.split('\n') || []
        if (this.post)
          this.shareContent = this.getShareContent(this.post)
        this.breadcrumb = [
          { text: this._coreService.titleCase(this.post.moduleText || this.post.moduleName), path: '/' + this.post.moduleSlug + 's' },
          { text: this.post.title }
        ]
        this.addMetaTags(this.post)
      } else {
        this.post = undefined
      }
    })
  }

  getShareContent(data: AdmissionDetails): ShareContent {
    let shareContent = new ShareContent();
    shareContent.admitCardDate = data.admitCardDate;
    shareContent.extendedDate = data.extendedDate;
    shareContent.lastDate = data.lastDate;
    shareContent.link = this.platformLocation.href; // fetch current url
    shareContent.startDate = data.startDate;
    shareContent.title = data.title;
    shareContent.totalPost = data.totalPost?.toString();
    return shareContent
  }

  addMetaTags(blockContaintDetails: AdmissionDetails) {
    let tags: MetaDefinition[] = [];

    tags.push({
      property: 'og:type',
      content: "article"
    })

    tags.push({
      property: 'description',
      content: this.shortDesc[0] || this.post?.title || ''
    })
    tags.push({
      property: 'og:description',
      content: this.shortDesc[0] || this.post?.title || ''
    })

    if (blockContaintDetails.title) {
      this._coreService.setPageTitle(blockContaintDetails.title)
      tags.push({
        property: 'og:title',
        content: blockContaintDetails.title
      })
    }

    if (blockContaintDetails.thumbnail || blockContaintDetails.departmentLogo) {
      tags.push({
        property: 'og:image',
        content: blockContaintDetails.thumbnail || blockContaintDetails.departmentLogo
      });
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

  manageBookmark(shouldAdd: boolean) {
    if (!this._authService.isUserLoggedIn()) {
      this._alert.info('Please login first');
      return;
    }
    this.isBookmarkLoading = true

    // @ts-ignore
    this._postService.manageBookmark(shouldAdd, this.post).subscribe((response) => {
      this.isBookmarkLoading = false;
      if (response.isSuccess) {
        if (shouldAdd)
          // @ts-ignore
          this.post.bookmarkId = response.data;
        else
          // @ts-ignore
          this.post.bookmarkId = null;
      } else {
        alert(response.message)
      }
    }, () => {
      this.isBookmarkLoading = false;
    })
  }
  GetUpCommingPost() {
    this.postListFilter.orderBy = 'upcoming';
    this.postListFilter.orderByAsc = 1;
    this.postListFilter.pageSize = 5;
    this.getList({ ...this.postListFilter }, 'upcoming');
  }
  GetLatestPost() {
    this.postListFilter.orderBy = 'latest';
    this.postListFilter.pageSize = 5;
    this.postListFilter.orderByAsc = 0;
    this.getList({ ...this.postListFilter }, 'latest');
  }
  GetExpirePost() {
    this.postListFilter.orderBy = 'expiredsoon';
    this.postListFilter.orderByAsc = 1;
    this.postListFilter.pageSize = 5;
    this.getList({ ...this.postListFilter }, 'expiredsoon');
  }

  getList(payload: PostListFilter, Type: string = '') {
    this._postService.getPostLists(payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.isSuccess) {
        if (Type == 'upcoming') {
          this.upcommingList = res.data ?? [];
          if (this.upcommingList) {
            this.upcommingList = this.upcommingList.filter(s => s.slugUrl != this.post?.slugUrl);
          }
        }
        if (Type == 'latest') {
          this.latestList = res.data ?? [];
          if (this.latestList) {
            this.latestList = this.latestList.filter(s => s.slugUrl != this.post?.slugUrl);
          }
        }
        if (Type == 'expiredsoon') {
          this.expiredList = res.data ?? [];
          if (this.expiredList) {
            this.expiredList = this.expiredList.filter(s => s.slugUrl != this.post?.slugUrl);
          }
        }
      } else {
        this.upcommingList = []
        this.latestList = []
        this.expiredList = []
      }
    })
  }
}
