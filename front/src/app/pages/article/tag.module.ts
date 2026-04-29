import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagsComponent } from './tags/tags.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';



@NgModule({
  declarations: [
    TagsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TagsComponent },
      { path: ':tagTypeSlug', component: ArticleListComponent },
      // { path: ':tagTypeSlug/:tagSlug', component: ArticleDetailsComponent }
    ])
  ]
})
export class TagModule { }
