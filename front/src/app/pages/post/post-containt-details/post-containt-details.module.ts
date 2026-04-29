import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { CustomAdsComponent } from 'src/app/core/components/custom-ads/custom-ads.component';
import { PostContaintDetailsComponent } from './post-containt-details.component';

const routes: Routes = [
  { path: '', component: PostContaintDetailsComponent },

]

@NgModule({
  declarations: [
    PostContaintDetailsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    CustomAdsComponent
  ]
})
export class PostContaintDetailsModule { }
