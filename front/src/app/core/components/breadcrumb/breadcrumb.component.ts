import { Component, Input, OnInit } from '@angular/core';
import { Breadcrumb } from '../../models/core.models';

@Component({
  selector: 'preptm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumb: Breadcrumb[] = []
  constructor(
  ) {
    // this._route.params.subscribe((params: Params) => {
    //   console.log(params);

    //   if (params['slug']) {
    //     this.slug = params['slug'].replace(/-/g, ' ')
    //   }

    // })

    // this._route.data.subscribe((data)=>{
    //   console.log(data);

    //   this.type = data['type'].replace(/-/g, ' ') + 's'
    // })
  }

  ngOnInit(): void {
  }

}
