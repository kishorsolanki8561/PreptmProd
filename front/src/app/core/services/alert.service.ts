import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private message: NzMessageService
  ) { }

  info(message: string) {
    this.message.info(message);
  }
}
