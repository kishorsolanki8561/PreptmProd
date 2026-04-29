import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional, PLATFORM_ID, Renderer2 } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { DepartmentDetail, DepartmentDetailsFilter } from 'src/app/core/models/department.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { PostService } from 'src/app/core/services/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'preptm-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss']
})
export class DepartmentDetailsComponent implements OnInit {
  department: DepartmentDetail | undefined;
  payload: DepartmentDetailsFilter = new DepartmentDetailsFilter();
  isLoading = false;

  private _isServer = false;
  isMobile = true;



  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _coreService: CoreService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('IS_MOBILE') private isMobileReq: any,
    public breakpointObserver: BreakpointObserver,
  ) {

    this._isServer = isPlatformServer(this.platformId);

    if (!this._isServer) {
      this.breakpointObserver.observe(['(max-width: 1024px)'])
        .subscribe((state: BreakpointState) => {
          if (state.matches)
            this.isMobile = true
          else
            this.isMobile = false
        });
    } else {
      this.isMobile = this.isMobileReq
    }

    this._route.params.subscribe((params: Params) => {
      this.payload.slugUrl = params['slug'];
      this.getDetails(this.payload)
    })
  }

  ngOnInit(): void {
  }
  getDetails(payload: DepartmentDetailsFilter) {
    this.department = undefined;
    this.isLoading = true
    this._postService.getDepartmentDetails(payload).subscribe(res => {
      this.isLoading = false
      if (res.isSuccess) {
        this.department = res.data
        this.addMetaTags(this.department)
      } else {
        this.department = undefined
      }
    }, () => {
      this.isLoading = false
      this.department = undefined
    })
  }

  addMetaTags(departmentDetails: DepartmentDetail ) {
    let tags: MetaDefinition[] = [];

    tags.push({
      property: 'og:type',
      content: "article"
    })
  
    if (departmentDetails.name) {
      tags.push({
        property: 'description',
        content: departmentDetails.name
      })
      tags.push({
        property: 'og:description',
        content: departmentDetails.name
      })

      this._coreService.setPageTitle(departmentDetails.name)
      
      tags.push({
        property: 'og:title',
        content: departmentDetails.name
      })

      tags.push({
        property: 'keywords',
        content: departmentDetails.name
      })
    }

    if (departmentDetails.logo) {
      tags.push({
        property: 'og:image',
        content: departmentDetails.logo
      })

      tags.push({
        property: 'og:image:alt',
        content: departmentDetails.name
      })

      tags.push({
        property: 'og:image:type',
        content: 'image/webp'
      })
    }


    this._coreService.manageMetaTags(tags, this.renderer);
  }

}
