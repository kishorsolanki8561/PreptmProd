import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NpsDetailsComponent } from './nps-details/nps-details.component';
import { CoreModule } from 'src/app/core/core.module';
import { CustomAdsComponent } from 'src/app/core/components/custom-ads/custom-ads.component';


const routes: Routes = [
  { path: '', component: NpsDetailsComponent }
]

@NgModule({
  declarations: [
    NpsDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    CustomAdsComponent

  ]
})
export class NotesPaperSyllabusModule { }
