import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, ToastMessage } from '../../services/alert.service';

const TOAST_DURATION_MS = 3000;

@Component({
  selector: 'preptm-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private sub?: Subscription;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly isBrowser: boolean;

  constructor(
    private alert: AlertService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.sub = this.alert.stream$.subscribe(toast => this.show(toast));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timers.forEach(t => clearTimeout(t));
    this.timers.clear();
  }

  trackById(_: number, t: ToastMessage) { return t.id; }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.cdr.markForCheck();
  }

  private show(toast: ToastMessage) {
    this.toasts = [...this.toasts, toast];
    this.cdr.markForCheck();
    const timer = setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS);
    this.timers.set(toast.id, timer);
  }
}
