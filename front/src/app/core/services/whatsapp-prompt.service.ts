import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppPromptService {
  private readonly _visible$ = new BehaviorSubject<boolean>(false);
  readonly visible$: Observable<boolean> = this._visible$.asObservable();

  show() { this._visible$.next(true); }
  hide() { this._visible$.next(false); }
}
