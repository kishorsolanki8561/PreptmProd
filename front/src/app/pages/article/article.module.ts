import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticlesComponent } from './articles/articles.component';


@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild([
      { path: '', component: ArticlesComponent },
      { path: ':articleTypeSlug', component: ArticleListComponent },
      { path: ':articleTypeSlug/:articleSlug', component: ArticleDetailsComponent }
    ])
  ]
})
export class ArticleModule { }
