import { Injectable, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
import { ApiService } from './api.service';
import { MetaData, ddl, ddlLookup } from '../models/core.models';
import { API_ROUTES } from '../api.routes';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreService {


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private _apiService: ApiService,
    private _title: Title,
    private _meta: Meta,
    @Inject(DOCUMENT) private document: any
  ) { }

  getCurrentLang() {
    // if (isPlatformBrowser(this.platformId)) {
    if (this.document.location.href.split('/')[3] == 'hi') {
      return 'hi'


      // }
    }
    return 'en'
  }

  getGetSearchTag() {
    let params = this.parseQueryString(this.document.location.href);
    return params;
  }
  parseQueryString(url: string): any {
    // Extract the query string from the URL
    let queryString = url.split('?')[1];
    if (queryString) {
      queryString = queryString.replaceAll("https://", "").replaceAll("http://", "");
      let pairs = queryString.split('&');

      // Initialize an empty object to store the parameters
      let params: any = {};

      // Loop through each pair and add it to the params object
      pairs.forEach((pair: any) => {
        let [key, value] = pair.split('=');
        params[key] = value;
      });
      return params;
    }
    return null;
    // Split the query string into key-value pairs
  }

  setLang(lang: 'en' | 'hi') {
    if (this.getCurrentLang() != lang) {
      if (lang == 'en') {
        if (isPlatformBrowser(this.platformId)) {
          let urlArr = this.document.location.href.split('/')
          urlArr.splice(3, 1)
          this.document.location.href = urlArr.join('/')
        }
      } else if (lang == 'hi') {
        if (isPlatformBrowser(this.platformId)) {
          let urlArr = this.document.location.href.split('/')
          urlArr.splice(3, 0, 'hi')
          this.document.location.href = urlArr.join('/')
        }
      }
    }
  }


  setLocalStorage(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getLocalStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key) || '');
      }
    }
  }

  clearLocalStorageVal() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
  remmoveFromLocalStorage(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
  deleteLocalStorageVal(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
  checkIsClientSide(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getDdl(ddlKeys: string) {
    return this._apiService.get<ddl>(API_ROUTES.ddl + ddlKeys)
  }

  GetDDLLookupData(SlugUrl: string = '', LookupType: string = '', LookupTypeId: string = '') {
    return this._apiService.get<ddlLookup>(API_ROUTES.getDDLLookupDataBy, { SlugUrl: SlugUrl, LookupType: LookupType, LookupTypeId: LookupTypeId })
  }

  jwtDecode(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }
  setPageTitle(title: string) {
    this._title.setTitle(title)
  }




  titleCase(str: string | null | undefined): string {
    if (!str) return '';
    return str.replace(/\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() +
          txt.substr(1).toLowerCase();
      });
  }

  copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }
  dateString(date: string) {
    let dt = new Date(date)

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"];

    const day = dt.getDate();

    const monthIndex = dt.getMonth();
    const monthName = monthNames[monthIndex];

    const year = dt.getFullYear();

    return `${day < 10 ? ('0' + day) : day}-${monthName}-${year}`;
  }

  manageMetaTags(metadataTags: MetaDefinition[], renderer: Renderer2) {

    //remove extra tags
    let newTagsName = metadataTags.map(x => x.property);
    let oldTags = this._meta.getTags('property');

    let notRemovableTagNames = ["viewport", "og:site_name", "robots"]

    for (let i = 0; i < oldTags.length; i++) {
      let oldTagPropertyName = oldTags[i].attributes.getNamedItem('property')?.value || ''
      if (!newTagsName.includes(oldTagPropertyName) && !notRemovableTagNames.includes(oldTagPropertyName)) {
        this._removeMetaTag(oldTagPropertyName);
      }
    }

    for (let i = 0; i < metadataTags.length; i++) {
      let tag = metadataTags[i];

      // add name descripton
      if (tag.property === "description") {
        if (this._isMetaTagExists(tag['property'] || '','name')) {
          this._updateMetaTag(tag,'name')
        } else {
          this._addMetaTag({
            name:tag.property,
            content:tag.content

          } as MetaDefinition);
        }
      }

      if (this._isMetaTagExists(tag['property'] || '')) {
        this._updateMetaTag(tag)
      } else {
        this._addMetaTag(tag);
      }
    }

    this.addCommonTags(renderer);
  }

  addCommonTags(renderer: Renderer2) {
    this.addAlternetLink(renderer);
    // this.addCanonicalTag(renderer);
    this.addUrlTag(renderer);
    this.addLocalTag(renderer);

  }

  private _addMetaTag(tag: MetaDefinition) {
    this._meta.addTag(tag);
  }

  private _updateMetaTag(tag: MetaDefinition,key:string='property') {
    this._meta.updateTag(tag, `${key}='${tag.property}'`)
  }

  private _removeMetaTag(tagName: string) {
    this._meta.removeTag(`property='${tagName}'`);
  }
  private _isMetaTagExists(tagName: string, key: string = 'property'): boolean {
    return !!this._meta?.getTag(`${key}='${tagName}'`);
  }

  addAlternetLink(renderer: Renderer2) {
    let arr = Array.from(this.document.head.children);
    let linkElt = arr.filter((e: any) => e.rel == "alternate" && (e.hreflang == "en" || e.hreflang == "hi" || e.hreflang == "x-default")) as any;

    let canonicalEle = arr.find((x: any) => x.rel == "canonical") as any;

    let linkEltEn = linkElt.filter((e: any) => (e.hreflang == "en"))?.[0] as any;
    let linkEltHi = linkElt.filter((e: any) => (e.hreflang == "hi"))?.[0] as any;
    let linkEltDefault = linkElt.filter((e: any) => (e.hreflang == "x-default"))?.[0] as any;

    let urlArr = this.document.location.href.split('/')
    let curUrl = this.document.location.href

    if (this.getCurrentLang() == 'hi') {
      // set english ref
      urlArr.splice(3, 1)
    } else {
      // set hindi ref
      urlArr.splice(3, 0, 'hi')
    }

    let link = urlArr.join('/')   // make complete link

    if (linkEltEn && linkEltHi && linkEltDefault) {
      //udpate
      // renderer.setAttribute(linkEltEn, 'hreflang', 'en');
      // renderer.setAttribute(linkEltHi, 'hreflang', 'hi');
      renderer.setAttribute(linkEltEn, 'href', this.getCurrentLang() == 'en' ? curUrl : link);
      renderer.setAttribute(linkEltHi, 'href', this.getCurrentLang() == 'en' ? link : curUrl);
      renderer.setAttribute(linkEltDefault, 'href', this.getCurrentLang() == 'en' ? curUrl : link);

    } else {
      // add

      linkEltEn = renderer.createElement('link');
      renderer.setAttribute(linkEltEn, 'rel', 'alternate');
      renderer.setAttribute(linkEltEn, 'hreflang', 'en');
      renderer.setAttribute(linkEltEn, 'href', this.getCurrentLang() == 'en' ? curUrl : link);
      renderer.appendChild(this.document.head, linkEltEn);

      linkEltHi = renderer.createElement('link');
      renderer.setAttribute(linkEltHi, 'rel', 'alternate');
      renderer.setAttribute(linkEltHi, 'hreflang', 'hi');
      renderer.setAttribute(linkEltHi, 'href', this.getCurrentLang() == 'en' ? link : curUrl);
      renderer.appendChild(this.document.head, linkEltHi);

      linkEltDefault = renderer.createElement('link');
      renderer.setAttribute(linkEltDefault, 'rel', 'alternate');
      renderer.setAttribute(linkEltDefault, 'hreflang', 'x-default');
      renderer.setAttribute(linkEltDefault, 'href', this.getCurrentLang() == 'en' ? curUrl : link);
      renderer.appendChild(this.document.head, linkEltDefault);

    }

    if (canonicalEle) {
      // update canonical link
      renderer.setAttribute(canonicalEle, 'href', this.getCurrentLang() == 'en' ? curUrl : link);
    } else {
      // add canonical link
      let canEle = renderer.createElement('link');
      renderer.setAttribute(canEle, 'rel', 'canonical');
      renderer.setAttribute(canEle, 'href', this.getCurrentLang() == 'en' ? curUrl : link);
      renderer.appendChild(this.document.head, canEle);
    }
  }

  addCanonicalTag(renderer: Renderer2) {

    let arr = Array.from(this.document.head.children);
    let linkElt = arr.find((e: any) => e.rel == "canonical");
    let link = 'https://preptm.com/' + ((this.getCurrentLang() == 'en') ? 'hi/' : '') + this.document.location.href.split('/').splice(3).join('/')
    if (linkElt) {
      //udpate
      renderer.setAttribute(linkElt, 'href', link);
    } else {
      // add
      linkElt = renderer.createElement('link');
      renderer.setAttribute(linkElt, 'rel', 'canonical');
      renderer.setAttribute(linkElt, 'href', link);
      renderer.appendChild(this.document.head, linkElt);
    }

  }


  addUrlTag(renderer: Renderer2) {

    let arr = Array.from(this.document.head.children);
    let linkElt = arr.find((e: any) => e.property == "og:url");
    let link = this.document.location.href;
    if (linkElt) {
      //udpate
      renderer.setAttribute(linkElt, 'content', link);
    } else {
      // add
      linkElt = renderer.createElement('meta');
      renderer.setAttribute(linkElt, 'property', 'og:url');
      renderer.setAttribute(linkElt, 'content', link);
      renderer.appendChild(this.document.head, linkElt);
    }

  }

  addLocalTag(renderer: Renderer2) {
    // adding og:locale
    let arr = Array.from(this.document.head.children);
    let linkElt = arr.find((e: any) => e.property == "og:locale");
    let content = this.getCurrentLang() == 'en' ? "en_IN" : "hi_IN"
    if (linkElt) {
      //udpate
      renderer.setAttribute(linkElt, 'content', content);
    } else {
      // add
      linkElt = renderer.createElement('meta');
      renderer.setAttribute(linkElt, 'property', 'og:locale');
      renderer.setAttribute(linkElt, 'content', content);
      renderer.appendChild(this.document.head, linkElt);
    }

    // adding og:locale:alternate
    arr = Array.from(this.document.head.children);
    linkElt = arr.find((e: any) => e.property == "og:locale:alternate");
    content = this.getCurrentLang() == 'hi' ? "en_IN" : "hi_IN"
    if (linkElt) {
      //udpate
      renderer.setAttribute(linkElt, 'content', content);
    } else {
      // add
      linkElt = renderer.createElement('meta');
      renderer.setAttribute(linkElt, 'property', 'og:locale:alternate');
      renderer.setAttribute(linkElt, 'content', content);
      renderer.appendChild(this.document.head, linkElt);
    }
  }

}



