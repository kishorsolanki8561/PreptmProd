import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { CustomAdsComponent } from 'src/app/core/components/custom-ads/custom-ads.component';
import { AdmissionDetailsComponent } from './admission-details.component';

const routes: Routes = [
  { path: '', component: AdmissionDetailsComponent },

]

@NgModule({
  declarations: [
    AdmissionDetailsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    CustomAdsComponent
  ]
})
export class AdmissionDetailsModule { }
