import { Component, Input } from '@angular/core';

@Component({
  selector: 'preptm-header-tile',
  templateUrl: './header-tile.component.html',
  styleUrls: ['./header-tile.component.scss']
})
export class HeaderTileComponent {
  @Input() titleName: string;
  @Input() viewMoreUrl: string;
}
