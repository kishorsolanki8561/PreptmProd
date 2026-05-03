import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ddlItem } from 'src/app/core/models/core.models';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'preptm-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = false
  categories: ddlItem[] = []
  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    this.getCategories()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCategories() {
    this.isLoading = true
    this._coreService.getDdl('ddlCategory').pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        this.categories = res.data.ddlCategory
      }
    })
  }

}
