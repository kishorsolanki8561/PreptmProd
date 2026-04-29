import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification';
import { debounceTime, of, switchMap } from 'rxjs';
import { ENABLE_LOGIN, PostTypesSlug } from 'src/app/core/fixed-values';
import { LoginReq } from 'src/app/core/models/auth.model';
// import { Post } from 'src/app/core/models/post.model';
import { user } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'preptm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private _searchService: SearchService,
    private renderer: Renderer2,
    private _coreService: CoreService,
    private _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NzNotificationService,
    public breakpointObserver: BreakpointObserver
  ) {
    if (_coreService.checkIsClientSide()) {
      // this.searchText.setValue(' ');
      this.historySerachText = [..._coreService.getLocalStorage('serach') || []]// [...JSON.parse(sessionStorage.getItem('serach') || '')]
    }

  }

  ENABLE_LOGIN = ENABLE_LOGIN
  keyword = 'title';
  showSearchList = false
  isSearchLoading = false
  historySerachText: string[] = [];
  searchTextList: string[] = [];
  searchText = new FormControl('');
  ishistory: boolean = true;
  isLoginLoading = false;
  isMobileMenuOpen = false;
  isSidebarOpen = false;
  lastSearchedText = '';
  showProfileMenu = false;
  isLangChanged = false

  @ViewChild('whatsappNotification', { static: true }) whatsappNotification: TemplateRef<{ $implicit: NzNotificationComponent }>;

  curLang: any;

  userDetails: user | null;
  isSearchCompleted = false

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('searchDiv') searchDiv: ElementRef;
  

  ngOnInit(): void {

    this.curLang = this._coreService.getCurrentLang();
    this.userDetails = this._authService.getUserDetails();


    //  to remove/set searched text
    this._router.events.subscribe((e) => {
      let currentRoute = this._route.root;
      while (currentRoute.children[0] !== undefined) {
        currentRoute = currentRoute.children[0];
      }
      if (e instanceof NavigationEnd) {

        // this.setPageTitle(currentRoute);

        let searchedVal = currentRoute.snapshot.params['searchedData']
        if (searchedVal) {
          this.searchText.setValue(searchedVal)
        } else {
          this.searchText.setValue(null)
        }
      }
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton.nativeElement && e.target !== this.searchDiv.nativeElement) {
        this.showSearchList = false;
      }
    });
    this.searchText.valueChanges.subscribe((res) => {
      if (!res) {
        this.searchTextList = [];
        this.ishistory = true;
        if (this._coreService.getLocalStorage('serach')) {
          this.historySerachText = [...this._coreService.getLocalStorage('serach') || []]
        }
      }
    });
    this.searchText.valueChanges.pipe(
      debounceTime(500),
      switchMap((query: any) => {
        if (query) {
          {
            this.ishistory = false;
            if (this.lastSearchedText != query) {
              this.lastSearchedText = query
              if (!this.isSearchCompleted)
                this.onGetPopularBySearchText();
            }
          }
        };
        return of(query);
      })
    ).subscribe();


    if (ENABLE_LOGIN) {
      this._authService.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          let user = this._authService.getUserDetails()
          this.userDetails = user ? { ...user } : null;
          this._coreService.setLang(this.userDetails?.language || 'en')
        } else {
          this.userDetails = null;
          // setTimeout(() => {
            // if (isPlatformBrowser(this.platformId)) {
            //   this.renderGoogleButton()
            // }
          // }, 0);
        }
      })
    }

    // this.breakpointObserver.observe(['(max-width: 1023px)'])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches)
    //       this.showWhatsappAlert();
    //   });

  }

  changeLang(lang: 'en' | 'hi') {
    this.isLangChanged = true
    this._coreService.setLang(lang);
  }

  // setPageTitle(currentRoute: ActivatedRoute) {
  //   let slug = currentRoute.snapshot.params['slug']?.replace(/-/g, ' ');
  //   if (slug) {
  //     this._coreService.setPageTitle(slug)
  //     return;
  //   }

  //   let categorySlug = currentRoute.snapshot.params['categorySlug']?.replace(/-/g, ' ');
  //   if (categorySlug) {
  //     this._coreService.setPageTitle(categorySlug)
  //     return;
  //   }

  //   let type = currentRoute.snapshot.data['type']?.replace(/-/g, ' ')
  //   if (type) {
  //     this._coreService.setPageTitle(type);
  //     return;
  //   }
  // }


  //#region <login>
  ngAfterViewInit() {
    if (ENABLE_LOGIN) {
      if (isPlatformBrowser(this.platformId)) {
        this.renderGoogleButton()
      }
    }
  }

  renderGoogleButton() {
    if (!this.userDetails) {
      this._authService.renderGoogleButton((resp: any) => {

        this.isLoginLoading = true;
        this.userDetails = null;
        resp = this._coreService.jwtDecode(resp.credential)
        // Here will be your response from Google.
        let payload = new LoginReq();
        payload.firstName = resp.given_name;
        payload.lastName = resp.family_name;
        payload.language = resp?.locale?.split('-')[0] || 'en';
        payload.profileImg = resp.picture;
        payload.email = resp.email;

        payload.mobileNumber = resp.phoneNumber;
        payload.platform = 'web';
        payload.provider = 'GOOGLE';
        payload.uId = resp.sub || ''

        this._authService.googleLogin(payload).subscribe((resp) => {
          this.isLoginLoading = false;
          if (resp.isSuccess) {
            this._coreService.setLocalStorage('user', resp.data);
            this._authService.loggedStatusChanged(true);
          } else {
            alert(resp.message);
          }
          this._cd.detectChanges();
        }, () => {
          this.isLoginLoading = false;
        })
      });
    }
  }
  //#endregion

  logout() {
    this.showProfileMenu = false;
    this._authService.logoutUser()
  }

  //#region <search>
  onSearchFocus() {
    this.showSearchList = true;
    this.isSearchCompleted = false;
  }
  onSearchFocusout() {
    if (!this.searchText.value)
      this.showSearchList = true;

  }

  onSearch(value: any) {
    if (String(value).trim()) {
      let searchText = value.trim();
      this.searchText.setValue(searchText);
      if (!this.historySerachText.includes(searchText)) {
        if (this.historySerachText.length < 4) {
          this.historySerachText.push(searchText);
        }
        else {
          this.historySerachText = [...this.historySerachText.slice(-1)];
          this.historySerachText.push(searchText);
        }
      }
      this._coreService.setLocalStorage('serach', this.historySerachText);

      this.showSearchList = false
      this.isSearchCompleted = true;
      this._router.navigate(['/search', searchText])
    }

  }


  onGetPopularBySearchText() {
    this.isSearchLoading = true
    this._searchService.GetPopularBySearchText(String(this.searchText.value?.trim())).subscribe((res) => {
      this.isSearchLoading = false
      if (res.isSuccess) {
        if (res.data) {
          this.searchTextList = res.data;
          this.showSearchList = true
        }
        else {
          this.searchTextList = []
        }
      }
    }, (error: any) => {
      this.isSearchLoading = false
      this.searchTextList = []
    })
  }
  onEnter() {

  }


  openMobileMenu() {
    this.isMobileMenuOpen = true
  }
  closeMobileMenu() {
    this.isMobileMenuOpen = false
  }
  closeSidebar() {
    this.isSidebarOpen = false
  }
  openSidebar() {
    this.isSidebarOpen = true;
  }

  //#endregion


  showWhatsappAlert() {
    // setTimeout(() => {
      this.notification.template(this.whatsappNotification, { nzDuration: 0, nzPlacement: 'bottomRight', nzClass: 'whatsapp-notification-container' });
    // }, 10000);
  }


}
