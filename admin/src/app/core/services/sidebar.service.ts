import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isSidebarCollapsed$ = new BehaviorSubject<boolean>(false);
  constructor() { }
  isFullscreen$ = new BehaviorSubject<boolean>(false);

  collapseSidebar() {
    this.isSidebarCollapsed$.next(true);
  }
  expandSidebar() {
    this.isSidebarCollapsed$.next(false);
    this.isFullscreen$.next(false);
  }
  toggleFullscreen() {
    const next = !this.isFullscreen$.getValue();
    this.isFullscreen$.next(next);
    if (next) this.isSidebarCollapsed$.next(true);
  }

  // getListUrl(pages: any[]): string {
  //   let url = pages.filter((url: any) => url['permissionType'] == 4)
  //   if (url.length)
  //     return '/' + url[0]['url']
  //   else
  //     return '/'
  // }

}
