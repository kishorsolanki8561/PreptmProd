import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoreModule } from 'src/app/core/core.module';
import { BannerComponent } from './home/banner/banner.component';
import { MobileMenuComponent } from './home/mobile-menu/mobile-menu.component';
import { PostContainerComponent } from './home/post-container/post-container.component';
import { CategoriesComponent } from './home/categories/categories.component';
import { AboutSiteComponent } from './home/about-site/about-site.component';
import { PostCardComponent } from './home/post-card/post-card.component';
import { HeaderTileComponent } from './home/header-tile/header-tile.component';
import { CustomButtonComponent } from './home/custom-button/custom-button.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
]


@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    MobileMenuComponent,
    PostContainerComponent,
    CategoriesComponent,
    AboutSiteComponent,
    PostCardComponent,
    HeaderTileComponent,
    CustomButtonComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule { }
