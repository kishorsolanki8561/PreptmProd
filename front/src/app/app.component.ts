import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'preptm';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.queryParams.subscribe((params: Params) => {

      //#region <rediret>
      if (params['moduleName'] && params['slugUrl']) {
        this._router.navigate(['/', params['moduleName'], params['slugUrl']])
      }
      //#endregion

    })
  }
}
