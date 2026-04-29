import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { first } from 'rxjs';
import { ApiResponseModel, Obj } from '../models/core.models';
import { environment } from 'src/environments/environment';
import { Observable, of, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { API_ROUTES } from '../api.routes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _isServer = false;
  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this._isServer = isPlatformServer(platformId);
  }

  private _objToQueryString(obj: any) {
    if (!obj)
      return ''
    let str = [];
    for (let key in obj)
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
      }
    return '?' + str.join("&");
  }

  get<T>(url: string, queryParams: Obj<any> | null = null, shouldCache = true): Observable<ApiResponseModel<T>> {
    let query = this._objToQueryString(queryParams)

    return this._httpClient.get(environment.baseApiUrl + url + query).pipe(first()) as Observable<ApiResponseModel<T>>
    // return this.checkAndGetData(url, query, this._httpClient.get(environment.baseApiUrl + url + query).pipe(first()), {}, shouldCache) as Observable<ApiResponseModel<T>>
  }
  post<T>(url: string, reqBody: Obj<any>, otherData?: Obj<any>, shouldCache = true): Observable<ApiResponseModel<T>> {
    //adding otherData to reqBody for send to api

    if (otherData) {
      for (let key in otherData) {
        if (otherData[key])
          reqBody[key] = otherData[key];
      }
    }

    return this._httpClient.post(environment.baseApiUrl + url, reqBody).pipe(first()) as Observable<ApiResponseModel<T>>
    // return this.checkAndGetData(url, JSON.stringify(reqBody), this._httpClient.post(environment.baseApiUrl + url, reqBody).pipe(first()), {}, shouldCache) as Observable<ApiResponseModel<T>>
  }


  // checkAndGetData(url: string, additionalData: string, getDataObservable: Observable<any>, defaultValue: any = {}, shouldCache = true) {
  //   let key = url + (additionalData || '');
  //   let sKey = makeStateKey(key);

  //   if (shouldCache && this.tstate.hasKey(sKey)) {
  //     return of(this.tstate.get(sKey, defaultValue));
  //   } else {
  //     return getDataObservable.pipe(
  //       tap((data) => {
  //         if (shouldCache) {
  //           this.tstate.set(sKey, data);
  //         }
  //       })
  //     );
  //   }
  // }



}
