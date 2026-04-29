import { Component, Inject, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { DATE_FORMAT } from '../../fixed-values';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'preptm-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() minimal: boolean = false
  @Input() post: Post;
  @Input() index: number | null = null
  DATE_FORMAT = DATE_FORMAT
  constructor(
    @Inject(DOCUMENT) public document: any
  ) { }

  ngOnInit(): void {
  }

}
