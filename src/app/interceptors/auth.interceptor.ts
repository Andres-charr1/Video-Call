
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const externalApiToken = localStorage.getItem('external_api_token');

    if (externalApiToken && req.url.includes('ravishing-courtesy-production.up.railway.app')) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${externalApiToken}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
