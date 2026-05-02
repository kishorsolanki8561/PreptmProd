import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-ads',
  standalone: true,
  imports: [],
  templateUrl: './custom-ads.component.html',
  styleUrl: './custom-ads.component.scss'
})
export class CustomAdsComponent {
  showAds = environment.showAds;
  whatsappLink: string = 'https://chat.whatsapp.com/BW9AIPdks2DJcjZlGQ24Tp';

  joinWhatsApp() {
    window.open(this.whatsappLink, '_blank');
  }
}
