import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { skip } from 'rxjs';
import { API_ROUTES } from 'src/app/core/api.routes';
import { DdlLookup, PostTypesSlug } from 'src/app/core/fixed-values';
import { Breadcrumb, PaginationModel, ddl, ddlLookup } from 'src/app/core/models/core.models';
import { BookmarkFilter, Post, PostListFilter, Search } from 'src/app/core/models/post.model';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  list: Post[] = [];
  filter = new PostListFilter();
  loading = false;
  type = ''
  categorySlug = ''
  ddls: ddl | undefined;
  ddlLookup: ddlLookup | undefined;
  search: string = '';
  postType = PostTypesSlug;
  showFilter: boolean = true;
  curModuleText: string = ''

  breadcrumb: Breadcrumb[] = []
  ddlLookupEnum = DdlLookup;
  pagination = new PaginationModel();
  isPrivate?: boolean | null = false;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _coreService: CoreService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) public document: any
  ) {
    this.type = this._route.snapshot.data['type'];
    // this.categorySlug = this._route.snapshot.params['categorySlug']
    if (this.type == PostTypesSlug.PRIVATE_RECRUITMENT) {
      this.isPrivate = true;
    } else if (this.type == PostTypesSlug.SEARCH) {
      this.isPrivate = null;
    }
  }

  ngOnInit(): void {
    this.filter.searchText = '';
    this._route.params.subscribe((params: Params) => {

      this.categorySlug = params['categorySlug']
      if (this.type == PostTypesSlug.SEARCH) {
        this.showFilter = false;
        this._route.params.subscribe((params: Params) => {
          if (params['searchedData']) {
            this.filter.blockTypeSlug = '';
            this.filter.orderBy = 'latest'
            this.filter.orderByAsc = 0;
            this.filter.isPrivate = this.isPrivate;

            this.filter.searchText = this.search = params['searchedData']
            this.filter.page = 1
            this.getList(this.filter)
          } else {
            this.search = ''
          }
        });
      } else {
        if (this.type == PostTypesSlug.BOOKMARK) {
          this.getBookmarks();
        }
        else {
          this.updateFilter();
        }
        if (this.type != PostTypesSlug.BOOKMARK) {
          this.getDdls();
        }
      }


    }, (err) => {
    })

    this._route.queryParams.pipe(skip(1)).subscribe((params: Params) => {
      this.filter.page = +params['page']
      this.getList(this.filter)
    })

  }

  updateFilter() {
    // this.filter = new PostListFilter();
    if (this.type === 'search' && this.filter.searchText) {

      this.getList(this.filter);
    }
    else {
      this.filter.blockTypeSlug = this.type;
      if (this.type == PostTypesSlug.POPULAR) {
        this.filter.orderBy = 'popular'
        this.filter.blockTypeSlug = '';
      }
      if (this.type == PostTypesSlug.UpCominingSoon) {
        this.filter.orderBy = 'upcoming';
        this.filter.orderByAsc = 1;
        this.filter.blockTypeSlug = '';
      }

      if (this.type == PostTypesSlug.ExpireSoon) {
        this.filter.orderBy = 'expiredsoon'
        this.filter.blockTypeSlug = '';
        this.filter.orderByAsc = 1;
      }

      if (this.type == PostTypesSlug.LATEST) {
        this.filter.blockTypeSlug = '';
        this.filter.orderBy = 'latest'
      }

      if (this.type == PostTypesSlug.CATEGORY) {
        this.filter.categorySlug = this.categorySlug;
        this.filter.categoryId = 0;
        this.filter.blockTypeSlug = '';

      }

      if (this.isPrivate) {
        this.filter.isPrivate = true;
        this.filter.blockTypeSlug = PostTypesSlug.RECRUITMENT;
      }

      if (this.type == PostTypesSlug.SCHEME) {
        this.getDdlLookupData();
      }
      this.filter.isPrivate = this.isPrivate;
      this.getList(this.filter);
    }

  }

  getDdls() {
    this._coreService.getDdl(API_ROUTES.post.filterDdl).subscribe((res) => {
      if (res.isSuccess) {
        this.ddls = res.data

        // fill categories
        if (this.categorySlug) {
          let categoryElement = this.ddls['ddlCategory'].find((item) => item.otherData.slugUrl.toLowerCase() == this.categorySlug.toLowerCase());
          this.filter.categoryId = categoryElement?.value || 0
        }

      } else {
        this.ddls = undefined
      }
    }, (err) => {
      this.loading = false
    })
  }

  getDdlLookupData() {
    this._coreService.GetDDLLookupData('', '', `${this.ddlLookupEnum.SchemeEligibility}`).subscribe((res) => {
      if (res.isSuccess) {
        this.ddlLookup = res.data
      } else {
        this.ddlLookup = undefined
      }
    }, (err) => {
      this.loading = false
    })
  }

  // onPageChange(page: number) {
  //   this.filter.page = page
  //   // if (this.type == PostTypesSlug.SEARCH) {
  //   //   this.getSearchedData()
  //   // } else {
  //   // }
  //   this.getList(this.filter)
  // }

  getSearchedData() {
    this.loading = true
    let payload = new Search()
    payload.page = this.filter.page
    payload.pageSize = this.filter.pageSize
    payload.searchText = this.search
    this._postService.search(payload).subscribe((res) => {
      this.loading = false
      if (res.isSuccess && res.totalRecords > 0) {
        this.list = res.data;
        this.pagination.totalItems = res.totalRecords;
        this.pagination.currentPage = this.filter.page;
      } else {
        this.list = []
        this.pagination.totalItems = 0
      }
    }, () => {
      this.loading = false
    })

  }

  getBookmarks() {
    this.loading = true
    this.showFilter = false
    let payload = new BookmarkFilter()
    payload.page = this.filter.page
    payload.pageSize = this.filter.pageSize
    this._postService.bookmarks(payload).subscribe((res) => {
      this.loading = false
      if (res.isSuccess && res.totalRecords > 0) {
        this.list = res.data;
        this.pagination.totalItems = res.totalRecords;
        this.pagination.currentPage = this.filter.page;
      } else {
        this.list = []
        this.pagination.totalItems = 0
      }
    }, () => {
      this.loading = false
    })

  }

  getList(payload: PostListFilter) {

    this.loading = true

    this._postService.getPostLists(payload).subscribe((res) => {
      this.loading = false
      if (res.isSuccess) {
        this.list = res.data ?? [];
        this._coreService.addCommonTags(this.renderer)
        if (res.totalRecords > 0) {
          this.pagination.totalItems = res.totalRecords;
          this.pagination.currentPage = this.filter.page;
        } else {
          this.pagination.totalItems = 0;
        }
        this.curModuleText = res?.otherData?.ModuleText || ''
        let currentPageName = ""
        if (this.type == PostTypesSlug.SEARCH) {
          currentPageName = "Search";
        } else if (this.isPrivate) {
          currentPageName = "Private Jobs";
        } else {
          currentPageName = res?.otherData?.ModuleText ?? '';
        }
        this.breadcrumb = [
          { text: this._coreService.titleCase(currentPageName) }
        ]
      } else {
        this.list = []
        this.pagination.totalItems = 0
      }
    }, () => {
      this.loading = false
    })

  }

  filterList() {
    this.filter.page = 1;
    if (!this.filter.departmentId)
      this.filter.departmentId = 0
    if (!this.filter.jobDesignationId)
      this.filter.jobDesignationId = 0
    if (!this.filter.qualificationId)
      this.filter.qualificationId = 0

    this.getList(this.filter);
  }

  clearAll() {
    this.filter.departmentId = 0;
    this.filter.jobDesignationId = 0;
    this.filter.qualificationId = 0;
    this.filter.title = '';
    this.filter.eligibilityId = 0;
    if (!this.categorySlug)
      this.filter.categoryId = 0;
    this.getList(this.filter);
  }



}
