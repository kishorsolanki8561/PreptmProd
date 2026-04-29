import { Component, OnInit } from '@angular/core';
import { ddlItem } from 'src/app/core/models/core.models';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'preptm-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  isLoading = false
  categories: ddlItem[] = []
  constructor(private _coreService: CoreService) {
  }
  
  ngOnInit(): void {
    this.getCategories()
  }

  getCategories() {
    this.isLoading = true
    this._coreService.getDdl('ddlCategory').subscribe(res => {
      if (res.isSuccess) {
        this.categories = res.data.ddlCategory
      } else {
      }
      this.isLoading = false
    },(err)=>{
    })
  }

}
