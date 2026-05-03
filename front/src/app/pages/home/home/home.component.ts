import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CockpitPanelsPosts, Post } from 'src/app/core/models/post.model';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'preptm-home',
 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  allPosts: CockpitPanelsPosts | undefined;
  isLoading = true;
  constructor(
    private _postService: PostService,
    private _coreService: CoreService,
    private renderer: Renderer2,
  ) {
    this._coreService.setPageTitle('Preptm : Latest Job Updates')
    this._postService.getPostsForCockpitPanels().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        if(res?.data?.privateRecruitments){
          res.data.privateRecruitments = res.data.privateRecruitments.map((item: Post) => {
            item.blockTypeSlug = "private-jobs";
            return item;
          });
        }
        this.allPosts = res.data
        this._coreService.addCommonTags(this.renderer)
      }
    })
  }

  ngOnInit(): void {
    this.addMetaTags()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addMetaTags() {
    let tags: MetaDefinition[] = [];

    tags.push({
      property: 'og:type',
      content: "website"
    })

    tags.push({
      property: 'description',
      content: "Get the latest government job updates, admit cards, results, syllabus, and previous papers on Preptm.com. Prepare for SSC, RRB, IBPS, and State PSC exams with accurate, timely information and free job alerts."
    })
    tags.push({
      property: 'og:description',
      content: "Get the latest government job updates, admit cards, results, syllabus, and previous papers on Preptm.com. Prepare for SSC, RRB, IBPS, and State PSC exams with accurate, timely information and free job alerts."
    })

    tags.push({
      property: 'og:title',
      content: "Preptm : Latest Job Updates"
    })

    tags.push({
      property: 'keywords',
      content: "Government Jobs 2025, Sarkari Naukri, Free Job Alert, Govt Job Notifications, Latest Govt Jobs, Competitive Exams in India, Online Govt Exam Preparation"
    })
    this._coreService.manageMetaTags(tags, this.renderer);
  }

}
