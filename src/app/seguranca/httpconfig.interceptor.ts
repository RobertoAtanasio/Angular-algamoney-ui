import { Injectable } from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if (request.url.includes('/oauth/token')) {
        return next.handle(request);
      }

      if (request.url.includes('/tokens/revoke')) {
        return next.handle(request);
      }

      const token: string = this.auth.obterToken();

      if (token) {
          request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
      }

      if (!request.headers.has('Content-Type')) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }

      if (request.url.includes('/lancamentos/anexo')) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
        // console.log('>> interceptors URL:', request.url);
        // console.log('>> interceptors headers:', request.headers);
      }

      if (!request.url.includes('/lancamentos/anexo')) {
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      }

      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // console.log('URL', event.url);
          }
          return event;
        }),
        // retry(1),
        catchError((error: HttpErrorResponse) => {
          console.log('URL:', request.url);
          return throwError(error);
        })
      );

    }
}
