import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorShownMap: Map<number, boolean> = new Map();

  constructor(private message: NzMessageService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const status = error.status;

        if (!this.errorShownMap.get(status)) {
          this.errorShownMap.set(status, true); 

          switch (status) {
            case 0:
              this.message.error('No se pudo conectar con el servidor.');
              break;
            case 400:
              this.message.warning('Solicitud incorrecta.');
              break;
            case 401:
              this.message.warning('No autorizado. Redirigiendo...');
              this.router.navigate(['/login']);
              break;
            case 403:
              this.message.error(
                'No tienes permisos para realizar esta acción.'
              );
              break;
            case 404:
              this.message.warning('Recurso no encontrado.');
              break;
            case 500:
              this.message.error('Error interno del servidor.');
              break;
            default:
              this.message.error(`Error inesperado: ${error.message}`);
              break;
          }

          setTimeout(() => this.errorShownMap.delete(status), 3000);
        }

        return throwError(() => error);
      })
    );
  }
}
