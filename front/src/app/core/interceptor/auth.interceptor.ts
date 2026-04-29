import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CoreService } from '../services/core.service';
import { EncryptionServiceService } from '../services/encryption-service.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    adminUrl: string = "";
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _coreService: CoreService,
        private _encrypt: EncryptionServiceService,
        @Inject(DOCUMENT) private document: any

    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object

        let newReq = req.clone();
        let params = this._coreService.getGetSearchTag();
        if (params && params.adminurl) {
            this.adminUrl = params["adminurl"];
        }
        let islocal = environment.isEncrypt //this.document.location.href && this.document.location.href.replaceAll("https://", "").replaceAll("http://", "").split(':').includes('localhost') || false;

        let encryptedBody = req.body && islocal ? this._encrypt.encrypt(JSON.stringify(req.body)) : req.body;
        // let encrypturlquery = "";
        let encrypturlquery = islocal && newReq.url.split("?")[1] ? newReq.url.split("?")[0] + "?" + this._encrypt.encrypt(newReq.url.split("?")[1]) : newReq.url;

        if (this._authService.accessToken && !this._authService.isTokenExpired(this._authService.accessToken)) {

            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
                    .set('lang', this._coreService.getCurrentLang()).set("adminurl", this.adminUrl).set("isMobileMode", "true"),
                responseType: islocal ? 'text' : 'json',
                url: encrypturlquery,
                body: encryptedBody,
            });
        } else {
            newReq = req.clone({
                headers: req.headers.set('lang', this._coreService.getCurrentLang()).set("adminurl", this.adminUrl).set("isMobileMode", "true"),
                responseType: islocal ? 'text' : 'json',
                url: encrypturlquery,
                body: encryptedBody
            });
        }
        // Response
        return next.handle(newReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.body && islocal) {
                        try {
                            // Decrypt the response body
                            const decryptedData = this._encrypt.decrypt(event.body);
                            return event.clone({ body: JSON.parse(decryptedData) });
                        } catch (error) {
                            // console.error('Decryption failed:', error);
                            throw new HttpErrorResponse({
                                error: 'Decryption failed',
                                status: event.status,
                                statusText: event.statusText,
                                url: event.url ?? undefined
                            });
                        }
                    } else {
                        return event;
                    }
                }
                return event;
            }),
            catchError((error) => {

                // Catch "401 Unauthorized" responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Sign out
                    this._authService.logoutUser();
                    alert("Please login")
                    this._router.navigate(['/'])
                }

                return throwError(error);
            })
        );

    }
}
