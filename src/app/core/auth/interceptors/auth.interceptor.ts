import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private allowedDomains = ['localhost'];
  private excludedUrls = ['/login']; 
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isExcludedUrl(req.url)) {
      return next.handle(req);
    }

    let authReq = req;
    const token = this.authService.getToken();

    if (token && this.isAllowedDomain(req.url)) {
      if (this.isTokenExpired(token)) {
        this.authService.logout(); 
        this.router.navigate(['/login']); 
        return throwError(() => new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
      }

      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private isAllowedDomain(url: string): boolean {
    return this.allowedDomains.some(domain => url.includes(domain));
  }

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some(excluded => url.includes(excluded));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch (e) {
      console.log(e);
      return true; 
    }
  }
}