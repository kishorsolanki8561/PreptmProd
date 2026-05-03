import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly _stream$ = new Subject<ToastMessage>();
  private _seq = 0;

  readonly stream$: Observable<ToastMessage> = this._stream$.asObservable();

  info(message: string) {
    this._stream$.next({ id: ++this._seq, text: message, type: 'info' });
  }
}
