import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { API_ROUTES } from 'src/app/core/api.routes';
import { ddl, ddlItem } from 'src/app/core/models/core.models';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit{
  ddls: ddl | undefined;
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
  ) {

  }

  topicsList: ddlItem[] = [];


  
  ngOnInit(): void {

    this._route.params.subscribe((params: Params) => {
      this.getTopic();
    })
  }

  getTopic() {
    this._postService.getTagsList(API_ROUTES.post.tagDdl).subscribe(res => {
      if (res.isSuccess) {
        this.ddls = res.data;
        this.topicsList = this.ddls['ddlGroup']
      }
    })
  }
}
