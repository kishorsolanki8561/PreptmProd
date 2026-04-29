import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationControlsComponent, PaginationControlsDirective } from 'ngx-pagination';

@Component({
  selector: 'preptm-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent extends PaginationControlsComponent {
  @Input('paginationData') p: PaginationControlsDirective;
  @Input() paginationId: string;
  @ViewChild('p') pagination:any
  currentRoute='' 

  
  constructor(
    private _router:Router
  ){
    super();
    this.currentRoute = this._router.url
    
  }
  // @Input() id: string;
  // @Input() maxSize: number;
  // @Output() pageChange: EventEmitter<number>;
  // @Output() pageBoundsCorrection: EventEmitter<number>;
  test(){
    debugger
  }
  
}
