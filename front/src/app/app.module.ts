import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay, withHttpTransferCacheOptions, withI18nSupport } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled'
    }),
    NoopAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
  ],
  providers: [
    provideClientHydration(
      withEventReplay(),
      withI18nSupport(),
      withHttpTransferCacheOptions({
        includePostRequests: true,
      }),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
  ) {


  }
}
