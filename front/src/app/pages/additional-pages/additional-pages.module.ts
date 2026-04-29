import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalPagesComponent } from './additional-pages.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdditionalPagesComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild([
      { path: '', component: AdditionalPagesComponent }
    ])
  ]
})
export class AdditionalPagesModule { }
