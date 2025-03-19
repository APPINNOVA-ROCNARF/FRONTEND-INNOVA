import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private allowedDomains = ['localhost']; 

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.authService.getToken();

    // Agregar token solo si la solicitud es a un dominio permitido
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

    // Cierra sesión si recibe un 401
    return next.handle(authReq).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Verifica si el dominio es permitido para enviar el token
  private isAllowedDomain(url: string): boolean {
    return this.allowedDomains.some(domain => url.includes(domain));
  }

  // Verifica si el token ha expirado
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch (e) {
      return true; 
    }
  }
}