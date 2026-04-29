import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderDirective } from './directive/loader.directive';
import { NzImageModule } from 'ng-zorro-antd/image';

import { NoRecordsComponent } from './components/no-records/no-records.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ShareButtonsComponent } from './components/share-buttons/share-buttons.component';
import { SafePipe } from './pipes/safe.pipe';
import { ImageComponent } from './components/image/image.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdsComponent } from './components/ads/ads.component';



const modules = [
  RouterModule,
  NzImageModule,
  NzBreadCrumbModule
]
const components = [
  PostComponent,
  LoaderDirective,
  LoaderComponent,
  NoRecordsComponent,
  BreadcrumbComponent,
  ShareButtonsComponent,
  SafePipe,
  PaginationComponent,
  ImageComponent,
  AdsComponent
]



@NgModule({
  declarations: [
    components,

  ],
  imports: [
    CommonModule,
    modules,
    NgxPaginationModule
  ],
  exports: [
    modules,
    components
  ]
})
export class CoreModule { }
