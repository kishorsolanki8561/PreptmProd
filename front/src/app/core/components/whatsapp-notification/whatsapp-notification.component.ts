import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { WhatsAppPromptService } from '../../services/whatsapp-prompt.service';

@Component({
  selector: 'preptm-whatsapp-notification',
  templateUrl: './whatsapp-notification.component.html',
  styleUrls: ['./whatsapp-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsAppNotificationComponent implements OnInit, OnDestroy {
  visible = false;
  private sub?: Subscription;
  private readonly isBrowser: boolean;

  constructor(
    private prompt: WhatsAppPromptService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.sub = this.prompt.visible$.subscribe(v => {
      this.visible = v;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss() {
    this.prompt.hide();
  }
}
