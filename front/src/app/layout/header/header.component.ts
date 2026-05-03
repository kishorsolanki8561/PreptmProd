import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { WhatsAppPromptService } from 'src/app/core/services/whatsapp-prompt.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private _searchService: SearchService,
    private renderer: Renderer2,
    private _coreService: CoreService,
    private _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private whatsappPrompt: WhatsAppPromptService,
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
  showProfileMenu = false;
  isLangChanged = false

  curLang: any;

  userDetails: user | null;
  isSearchCompleted = false

  private destroy$ = new Subject<void>();
  private suggestionCache = new Map<string, string[]>();
  private static readonly SUGGESTION_CACHE_LIMIT = 50;
  private static readonly SUGGESTION_MIN_LENGTH = 2;

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('searchDiv') searchDiv: ElementRef;
  

  ngOnInit(): void {

    this.curLang = this._coreService.getCurrentLang();
    this.userDetails = this._authService.getUserDetails();


    this._router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      let currentRoute = this._route.root;
      while (currentRoute.children[0] !== undefined) {
        currentRoute = currentRoute.children[0];
      }
      const searchedVal = currentRoute.snapshot.params['searchedData'];
      this.searchText.setValue(searchedVal || null);
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton?.nativeElement && e.target !== this.searchDiv?.nativeElement) {
        this.showSearchList = false;
      }
    });

    this.searchText.valueChanges.pipe(
      map(v => (v ?? '').trim()),
      // Reset to history view immediately when the input is cleared, before
      // the debounce, so the dropdown swap is not delayed.
      tap(q => {
        if (!q) {
          this.searchTextList = [];
          this.ishistory = true;
          const stored = this._coreService.getLocalStorage('serach');
          if (stored) {
            this.historySerachText = [...stored];
          }
        }
      }),
      debounceTime(250),
      distinctUntilChanged(),
      filter(q => q.length >= HeaderComponent.SUGGESTION_MIN_LENGTH && !this.isSearchCompleted),
      tap(() => this.ishistory = false),
      // switchMap cancels the in-flight request on each new keystroke, so a
      // late response from an earlier query cannot overwrite the current list.
      switchMap(q => {
        const cached = this.suggestionCache.get(q);
        if (cached) {
          this.searchTextList = cached;
          this.showSearchList = true;
          return of(null);
        }
        this.isSearchLoading = true;
        return this._searchService.GetPopularBySearchText(q).pipe(
          tap(res => {
            this.isSearchLoading = false;
            if (res.isSuccess && res.data) {
              this.cacheSuggestions(q, res.data);
              this.searchTextList = res.data;
              this.showSearchList = true;
            } else {
              this.searchTextList = [];
            }
          }),
          catchError(() => {
            this.isSearchLoading = false;
            this.searchTextList = [];
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
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


  private cacheSuggestions(query: string, data: string[]) {
    if (this.suggestionCache.size >= HeaderComponent.SUGGESTION_CACHE_LIMIT) {
      const oldestKey = this.suggestionCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.suggestionCache.delete(oldestKey);
      }
    }
    this.suggestionCache.set(query, data);
  }

  trackBySuggestion(_: number, item: string) {
    return item;
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
    this.whatsappPrompt.show();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.suggestionCache.clear();
  }

}
