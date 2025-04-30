import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { UiService } from '../../services/ui-service/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private uiService: UiService, private router: Router) {}

  canActivate(
  ): Observable<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      this.uiService.loadMenu(); 
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
