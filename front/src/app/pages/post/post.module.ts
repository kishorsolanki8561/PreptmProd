import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { PostListComponent } from './post-list/post-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PostTypesSlug } from 'src/app/core/fixed-values';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthorComponent } from 'src/app/core/components/author/author.component';
import { FormsModule } from '@angular/forms';
import { CustomAdsComponent } from "../../core/components/custom-ads/custom-ads.component";
import { SelectComponent } from 'src/app/core/components/select/select.component';

const routes: Routes = [

  { path: PostTypesSlug.RECRUITMENT, component: PostListComponent, data: { type: PostTypesSlug.RECRUITMENT } },

  { path: PostTypesSlug.PRIVATE_RECRUITMENT, component: PostListComponent, data: { type: PostTypesSlug.PRIVATE_RECRUITMENT } },

  { path: PostTypesSlug.SCHEME, component: PostListComponent, data: { type: PostTypesSlug.SCHEME } },

  //#region <post containt>
  { path: PostTypesSlug.ADMITCARD, component: PostListComponent, data: { type: PostTypesSlug.ADMITCARD } },

  { path: PostTypesSlug.SYLLABUS, component: PostListComponent, data: { type: PostTypesSlug.SYLLABUS } },

  { path: PostTypesSlug.RESULT, component: PostListComponent, data: { type: PostTypesSlug.RESULT } },

  { path: PostTypesSlug.PAPER, component: PostListComponent, data: { type: PostTypesSlug.PAPER } },

  { path: PostTypesSlug.EXAM, component: PostListComponent, data: { type: PostTypesSlug.EXAM } },

  { path: PostTypesSlug.Answerkey, component: PostListComponent, data: { type: PostTypesSlug.Answerkey } },

  { path: PostTypesSlug.Onlineform, component: PostListComponent, data: { type: PostTypesSlug.Onlineform } },

  //#endregion

  { path: PostTypesSlug.ADMISSION, component: PostListComponent, data: { type: PostTypesSlug.ADMISSION } },

  { path: PostTypesSlug.BOOKMARK, component: PostListComponent, data: { type: PostTypesSlug.BOOKMARK } },

  { path: 'search/:searchedData', component: PostListComponent, data: { type: PostTypesSlug.SEARCH } },

  { path: 'latest', component: PostListComponent, data: { type: PostTypesSlug.LATEST } },
  { path: 'popular', component: PostListComponent, data: { type: PostTypesSlug.POPULAR } },
  { path: 'upcoming', component: PostListComponent, data: { type: PostTypesSlug.UpCominingSoon } },
  { path: 'expiresoon', component: PostListComponent, data: { type: PostTypesSlug.ExpireSoon } },

  { path: ':categorySlug', component: PostListComponent, data: { type: PostTypesSlug.CATEGORY } },

]

@NgModule({
  declarations: [
    PostListComponent,
    AuthorComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    FormsModule,
    CustomAdsComponent,
    SelectComponent
]
})
export class PostModule { }
