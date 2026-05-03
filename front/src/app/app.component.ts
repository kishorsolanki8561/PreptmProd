import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  title = 'preptm';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {

      //#region <rediret>
      if (params['moduleName'] && params['slugUrl']) {
        this._router.navigate(['/', params['moduleName'], params['slugUrl']])
      }
      //#endregion

    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
