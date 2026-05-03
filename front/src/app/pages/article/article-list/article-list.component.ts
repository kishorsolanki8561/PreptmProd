import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, takeUntil } from 'rxjs';
import { CoreModule } from 'src/app/core/core.module';
import { Breadcrumb, PaginationModel } from 'src/app/core/models/core.models';
import { ArticleList, ArticleListFilter } from 'src/app/core/models/post.model';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-article-list',
  templateUrl: './article-list.component.html',
  standalone: true,
  imports: [CoreModule, CommonModule, NgxPaginationModule],
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  articleItems: ArticleList[] | [];
  latestArticles: ArticleList[] | [];
  breadcrumb: Breadcrumb[] = []

  typeSlug = ''
  moduleName = ''
  payload = new ArticleListFilter();
  pagination = new PaginationModel();


  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _coreService: CoreService
  ) {

    this._route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.payload.tagTypeSlug = params['tagTypeSlug'] || ''
      this.payload.articleTypeSlug = params['articleTypeSlug'] || ''
      // this.articleList();
    })

    this._route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      if (params['page'])
        this.payload.page = +params['page']
      this.articleList()
    })

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  articleList() {
    this._postService.getArticleList(this.payload).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.isSuccess) {
        // this.articleItems = [...res.data ?? []];
        this.articleItems = [...res.data?.articles ?? []];
        this.latestArticles = [...res.data.latestArticle ?? []]
        this.moduleName = res.otherData['moduleText'];
        this.pagination.totalItems = res.totalRecords;

        this.breadcrumb = [
          { text: this.payload.tagTypeSlug ? 'Topic' : 'Article', path: '../' },
          { text: this._coreService.titleCase(res?.otherData?.moduleText ?? '') }
        ]

      }
    })
  }



}
