import { Component, OnInit } from '@angular/core';
import { ddlItem } from 'src/app/core/models/core.models';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'preptm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
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

  getCategories() {
    this._coreService.getDdl('ddlCategory').subscribe(res => {
      if (res.isSuccess) {
        this.categories = res.data.ddlCategory
      } else {
      }
    })
  }

}
