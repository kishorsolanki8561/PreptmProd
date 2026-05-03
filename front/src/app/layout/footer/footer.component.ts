import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ddlItem } from 'src/app/core/models/core.models';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'preptm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  categories: ddlItem[];
  lang: string = "";
  constructor(
    private _coreService: CoreService
  ) {
    // this.getCategories()
    this.lang = this._coreService.getCurrentLang().includes('en') ? "" : "/hi";
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCategories() {
    this._coreService.getDdl('ddlCategory').pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.isSuccess) {
        this.categories = res.data.ddlCategory
      } else {
      }
    })
  }

}
