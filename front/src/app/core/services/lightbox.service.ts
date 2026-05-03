import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LightboxImage {
  src: string;
  alt?: string;
}

export interface LightboxState {
  images: LightboxImage[];
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  private readonly _state$ = new BehaviorSubject<LightboxState | null>(null);
  readonly state$: Observable<LightboxState | null> = this._state$.asObservable();

  open(images: LightboxImage[], startIndex = 0) {
    if (!images || !images.length) return;
    const safeIndex = Math.max(0, Math.min(startIndex, images.length - 1));
    this._state$.next({ images, index: safeIndex });
  }

  next() {
    const s = this._state$.value;
    if (!s) return;
    const i = (s.index + 1) % s.images.length;
    this._state$.next({ ...s, index: i });
  }

  prev() {
    const s = this._state$.value;
    if (!s) return;
    const i = s.index === 0 ? s.images.length - 1 : s.index - 1;
    this._state$.next({ ...s, index: i });
  }

  close() {
    this._state$.next(null);
  }
}
