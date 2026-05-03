import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { API_ROUTES } from 'src/app/core/api.routes';
import { ddl, ddlItem } from 'src/app/core/models/core.models';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  ddls: ddl | undefined;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
  ) {

  }

  topicsList: ddlItem[] = [];


  
  ngOnInit(): void {

    this._route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.getTopic();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTopic() {
    this._postService.getTagsList(API_ROUTES.post.tagDdl).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.isSuccess) {
        this.ddls = res.data;
        this.topicsList = this.ddls['ddlGroup']
      }
    })
  }
}
