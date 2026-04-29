import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-ads',
  standalone: true,
  imports: [],
  templateUrl: './custom-ads.component.html',
  styleUrl: './custom-ads.component.scss'
})
export class CustomAdsComponent {
  whatsappLink: string = 'https://chat.whatsapp.com/BW9AIPdks2DJcjZlGQ24Tp';

  joinWhatsApp() {
    window.open(this.whatsappLink, '_blank');
  }
}
