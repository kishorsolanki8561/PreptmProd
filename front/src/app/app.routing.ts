import { Routes } from "@angular/router";
import { AdditionalPages, PostTypesSlug } from "./core/fixed-values";
import { NoRecordsComponent } from "./core/components/no-records/no-records.component";

export const routes: Routes = [

  { path: 'department', loadChildren: () => import('./pages/department/department.module').then(m => m.DepartmentModule) },
  { path: 'terms-and-conditions', loadChildren: () => import('./pages/additional-pages/additional-pages.module').then(m => m.AdditionalPagesModule), data: { type: AdditionalPages.TermsConditions } },
  { path: 'privacy-policy', loadChildren: () => import('./pages/additional-pages/additional-pages.module').then(m => m.AdditionalPagesModule), data: { type: AdditionalPages.PrivacyPolicy } },
  { path: 'about-us', loadChildren: () => import('./pages/additional-pages/additional-pages.module').then(m => m.AdditionalPagesModule), data: { type: AdditionalPages.AboutUs } },
  { path: 'disclaimer', loadChildren: () => import('./pages/additional-pages/additional-pages.module').then(m => m.AdditionalPagesModule), data: { type: AdditionalPages.Disclaimer } },
  { path: 'manage-account', loadChildren: () => import('./pages/additional-pages/additional-pages.module').then(m => m.AdditionalPagesModule), data: { type: AdditionalPages.ManageAccount } },
  { path: 'contact', loadChildren: () => import('./pages/contact-us/contact-us.module').then(m => m.ContactUsModule) },
  { path: 'article', loadChildren: () => import('./pages/article/article.module').then(m => m.ArticleModule) },
  { path: 'topic', loadChildren: () => import('./pages/article/tag.module').then(m => m.TagModule) },

  // { path: 'paper', loadChildren: () => import('./pages/papers/papers.module').then(m => m.PapersModule) },
  // { path: PostTypesSlug.PAPER + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.PAPER } },
  // { path: PostTypesSlug.SYLLABUS + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.SYLLABUS } },
  { path: PostTypesSlug.PAPER + '/:slug', loadChildren: () => import('./pages/notes-paper-syllabus/notes-paper-syllabus.module').then(m => m.NotesPaperSyllabusModule), data: { type: PostTypesSlug.PAPER } },
  { path: PostTypesSlug.SYLLABUS + '/:slug', loadChildren: () => import('./pages/notes-paper-syllabus/notes-paper-syllabus.module').then(m => m.NotesPaperSyllabusModule), data: { type: PostTypesSlug.SYLLABUS } },
  { path: PostTypesSlug.NOTES + '/:slug', loadChildren: () => import('./pages/notes-paper-syllabus/notes-paper-syllabus.module').then(m => m.NotesPaperSyllabusModule), data: { type: PostTypesSlug.NOTES } },



  { path: PostTypesSlug.SCHEME + '/:slug', loadChildren: () => import('./pages/post/scheme-details/scheme-details.module').then(m => m.SchemeDetailsModule) },
  { path: PostTypesSlug.RECRUITMENT + '/:slug', loadChildren: () => import('./pages/post/recruitment-details/recruitment-details.module').then(m => m.RecruitmentDetailsModule) },
  { path: PostTypesSlug.PRIVATE_RECRUITMENT + '/:slug', loadChildren: () => import('./pages/post/recruitment-details/recruitment-details.module').then(m => m.RecruitmentDetailsModule) },
  { path: PostTypesSlug.ADMISSION + '/:slug', loadChildren: () => import('./pages/post/admission-details/admission-details.module').then(m => m.AdmissionDetailsModule) },
  { path: PostTypesSlug.ADMITCARD + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.ADMITCARD } },
  { path: PostTypesSlug.RESULT + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.RESULT } },
  { path: PostTypesSlug.EXAM + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.EXAM } },
  { path: PostTypesSlug.Answerkey + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.Answerkey } },
  { path: PostTypesSlug.Onlineform + '/:slug', loadChildren: () => import('./pages/post/post-containt-details/post-containt-details.module').then(m => m.PostContaintDetailsModule), data: { type: PostTypesSlug.Onlineform } },

  { path: '', pathMatch: "full", loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: '', loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule) },
  { path: '404', component: NoRecordsComponent },
  { path: '**', component: NoRecordsComponent }
]
