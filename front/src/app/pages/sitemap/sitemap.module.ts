import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SitemapComponent } from './sitemap.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [SitemapComponent],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild([
      { path: '', component: SitemapComponent }
    ])
  ]
})
export class SitemapModule {}
