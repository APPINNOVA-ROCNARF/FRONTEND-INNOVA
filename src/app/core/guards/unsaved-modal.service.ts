import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  constructor(private modalService: NzModalService) {}

  showUnsavedChangesConfirmation(): Observable<boolean> {
    const modal = this.modalService.confirm({
      nzTitle: 'Cambios sin guardar',
      nzContent: 'Tienes cambios sin guardar. ¿Deseas salir sin guardar?',
      nzOkText: 'Salir sin guardar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => true,
      nzCancelText: 'Permanecer',
      nzOnCancel: () => false
    });

    return from(modal.afterClose).pipe(
      switchMap(result => of(!!result))
    );
  }
}