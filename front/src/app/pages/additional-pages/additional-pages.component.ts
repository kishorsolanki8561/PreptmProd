import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { API_ROUTES } from 'src/app/core/api.routes';
import { AdditionalPages } from 'src/app/core/fixed-values';
import { AdditionalPagesService } from 'src/app/core/services/additional-pages.service';

@Component({
  selector: 'preptm-additional-pages',
  templateUrl: './additional-pages.component.html',
  styleUrls: ['./additional-pages.component.scss']
})
export class AdditionalPagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  pageType = this._route.snapshot.data['type']
  AdditionalPages = AdditionalPages
  data: string = ''
  isLoading = false

  constructor(
    private _route: ActivatedRoute,
    private _additionaPageService:AdditionalPagesService
  ) { }

  ngOnInit(): void {
    this.isLoading = true
    this._additionaPageService.getAdditionalPage(this.pageType).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe((resp) => {
      if (resp.isSuccess) {
        this.data = resp.data as string
      } else {
        this.data = ''
      }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
