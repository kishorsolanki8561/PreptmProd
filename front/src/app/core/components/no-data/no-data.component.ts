import { Component, Input } from '@angular/core';

@Component({
  selector: 'preptm-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {
  @Input() title: string = $localize`No results found`;
  @Input() message: string = $localize`We couldn't find anything matching your filters. Try adjusting them or clearing all filters.`;
}
