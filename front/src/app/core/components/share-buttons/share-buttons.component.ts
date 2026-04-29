import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CoreService } from '../../services/core.service';
import { ShareContent } from '../../models/core.models';

@Component({
  selector: 'preptm-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss']
})
export class ShareButtonsComponent implements OnInit {
  showShareButtons = false
  socialMediaShareLink = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',   //quote is used for text
    twitter: "http://x.com/share?text=",
    whatsapp: "https://api.whatsapp.com/send?text=",
    telegram: "https://t.me/share/url?url=",
    copy:""
  }
  @Input() content: ShareContent;
  constructor(
    private _alertService: AlertService,
    private _coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.prepareContent();
  }

  prepareContent() {
    if (!this.content) {
      return;
    }
    // creating main content
    let contentBody = ''
    contentBody += this.content.totalPost ? `▪️ Total Posts : ${this.content.totalPost}%0A` : '';
    contentBody += this.content.startDate ? `▪️ Start Date : ${this._coreService.dateString(this.content.startDate)}%0A` : '';
    contentBody += this.content.date ? `▪️ Date : ${this._coreService.dateString(this.content.date)}%0A` : '';
    contentBody += this.content.lastDate ? `▪️ Last Date : ${this._coreService.dateString(this.content.lastDate)}%0A` : '';
    contentBody += this.content.extendedDate ? `▪️ Extended Date : ${this._coreService.dateString(this.content.extendedDate)}%0A` : '';
    contentBody += this.content.admitCardDate ? `▪️ Admit Card Date : ${this._coreService.dateString(this.content.admitCardDate)}%0A  %0A` : '';
    contentBody += this.content.FeeLastDate ? `▪️ Fee Last Date : ${this._coreService.dateString(this.content.FeeLastDate)}%0A  %0A` : '';


    // facebook
    this.socialMediaShareLink.facebook += this.content.link

    // whatsapp
    this.socialMediaShareLink.whatsapp += this.content.title ? `*${encodeURIComponent(this.content.title)}* %0A %0A` : '';
    this.socialMediaShareLink.whatsapp += contentBody;
    this.socialMediaShareLink.whatsapp += `%0AClick below link for more details 👇🏻 %0A`;
    this.socialMediaShareLink.whatsapp += `${this.content.link} %0A  %0A`;
    this.socialMediaShareLink.whatsapp += `Join us to stay updated %0A`;
    this.socialMediaShareLink.whatsapp += `Telegram : https://t.me/official_5study %0A`;
    this.socialMediaShareLink.whatsapp += `Whatsapp : https://chat.whatsapp.com/BW9AIPdks2DJcjZlGQ24Tp`;

    // twitter
    this.socialMediaShareLink.twitter += this.content.title ? `${encodeURIComponent(this.content.title)} %0A %0A` : '';
    this.socialMediaShareLink.twitter += contentBody;
    this.socialMediaShareLink.twitter += `${this.content.link}`;

    // telegram
    this.socialMediaShareLink.telegram += this.content.title ? `${encodeURIComponent(this.content.title)} %0A %0A` : '';
    this.socialMediaShareLink.telegram += contentBody;
    this.socialMediaShareLink.telegram += `%0AClick below link for more details 👇🏻 %0A`;
    this.socialMediaShareLink.telegram += `${this.content.link} %0A  %0A`;
    this.socialMediaShareLink.telegram += `Telegram : https://t.me/official_5study %0A`;
    this.socialMediaShareLink.telegram += `Whatsapp : https://chat.whatsapp.com/BW9AIPdks2DJcjZlGQ24Tp`;
    
    // copy
    this.socialMediaShareLink.copy += this.content.title ? `${this.content.title} \n\n` : '';
    this.socialMediaShareLink.copy += contentBody;
    this.socialMediaShareLink.copy += `%0AClick below link for more details 👇🏻 \n`;
    this.socialMediaShareLink.copy += `${this.content.link} \n  \n`;
    this.socialMediaShareLink.copy += `Join us to stay updated \n`;
    this.socialMediaShareLink.copy += `Telegram : https://t.me/official_5study \n`;
    this.socialMediaShareLink.copy += `Whatsapp : https://chat.whatsapp.com/BW9AIPdks2DJcjZlGQ24Tp`;
    this.socialMediaShareLink.copy = this.socialMediaShareLink.copy.replace(/%0A/g,'\n')
  }

  copy() {
    this._coreService.copyTextToClipboard(this.socialMediaShareLink.copy)
    this._alertService.info("Copied")
  }
  toggle() {
    this.showShareButtons = !this.showShareButtons
  }
  close() {
    this.showShareButtons = false
  }

}
