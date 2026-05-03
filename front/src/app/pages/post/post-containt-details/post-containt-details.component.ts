import { PlatformLocation } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { DATE_FORMAT, ExamModeEnum, PreptmLogo } from 'src/app/core/fixed-values';
import { Breadcrumb, ShareContent } from 'src/app/core/models/core.models';
import { BlockContaintDetails, Post, PostListFilter } from 'src/app/core/models/post.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-post-containt-details',
  templateUrl: './post-containt-details.component.html',
  styleUrls: ['./post-containt-details.component.scss']
})
export class PostContaintDetailsComponent implements OnInit {
  post: BlockContaintDetails | undefined;
  DATE_FORMAT = DATE_FORMAT
  ExamModeEnum = ExamModeEnum
  isBookmarkLoading = false;
  shareContent: ShareContent;
  slug: string;
  isLoading = false
  preptmLogo = PreptmLogo

  breadcrumb: Breadcrumb[] = []
  postListFilter: PostListFilter = new PostListFilter();
  upcommingList: Post[] = [];
  latestList: Post[] = [];
  expiredList: Post[] = [];
  shortDesc: string[] = [];
  lang: string;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _coreService: CoreService,
    private renderer: Renderer2,
    public platformLocation: PlatformLocation,
  ) {
    this.lang = this._coreService.getCurrentLang()
  }

  ngOnInit(): void {
    this._route.params.subscribe((params: Params) => {
      this.getBlockContaintDetails(params['slug']);
    });

    // this.GetUpCommingPost();
    // this.GetExpirePost();
    // this.GetLatestPost();
  }

  getBlockContaintDetails(slug: string) {
    this.post = undefined;
    this.isLoading = true
    this._postService.getBlockContaintDetails(slug).subscribe(res => {
      this.isLoading = false
      if (res.isSuccess && res.data) {

        this.post = res.data
        this.shortDesc = res.data.summary?.split('\n')
        this.shareContent = this.getShareContent(this.post);

        this.breadcrumb = [
          { text: this._coreService.titleCase(this.post?.moduleText || this.post?.moduleName), path: '/' + this.post.moduleSlug },
          { text: this.post.title }
        ]
        this.addMetaTags(this.post)
      } else {
        this.post = undefined
      }
    })
  }

  addMetaTags(blockContaintDetails: BlockContaintDetails) {
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

  getShareContent(data: BlockContaintDetails): ShareContent {
    let shareContent = new ShareContent()
    shareContent.extendedDate = data.extendedDate;
    shareContent.lastDate = data.lastDate;
    shareContent.link = this.platformLocation.href; // fetch current url
    shareContent.startDate = data.startDate;
    shareContent.FeeLastDate = data.feePaymentLastDate
    shareContent.title = data.title;
    return shareContent
  }

  manageBookmark(shouldAdd: boolean) {
    if (!this._authService.isUserLoggedIn()) {
      alert('Please login first');
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
    this._postService.getPostLists(payload).subscribe((res) => {
      if (res.isSuccess) {
        if (Type == 'upcoming') {
          this.upcommingList = res.data ?? [];
          if (this.upcommingList) {
            this.upcommingList = this.upcommingList.filter(s => s.title != this.post?.title);
          }
        }
        if (Type == 'latest') {
          this.latestList = res.data ?? [];
          if (this.latestList) {
            this.latestList = this.latestList.filter(s => s.title != this.post?.title);
          }
        }
        if (Type == 'expiredsoon') {
          this.expiredList = res.data ?? [];
          if (this.expiredList) {
            this.expiredList = this.expiredList.filter(s => s.title != this.post?.title);
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
