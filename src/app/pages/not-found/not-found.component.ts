import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NzResultModule, NzButtonModule],
  template: `
    <div class="not-found-container">
      <nz-result
        nzStatus="404"
        nzTitle="404 - Página no encontrada"
        nzSubTitle="Lo sentimos, la página que buscas no existe o fue movida."
      >
        <div nz-result-extra>
          <button nz-button nzType="primary" (click)="goHome()">
            Volver al Inicio
          </button>
        </div>
      </nz-result>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  goHome(): void {
    this.router.navigate(['/welcome']);
  }
}
