import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeDetailsComponent } from './scheme-details.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { CustomAdsComponent } from 'src/app/core/components/custom-ads/custom-ads.component';
import { PostTypesSlug } from 'src/app/core/fixed-values';

const routes: Routes = [
  { path: '', component: SchemeDetailsComponent },

]

@NgModule({
  declarations: [
    SchemeDetailsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    CustomAdsComponent
  ]
})
export class SchemeDetailsModule { }
