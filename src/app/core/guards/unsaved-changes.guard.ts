import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CanExitWithUnsavedChanges } from './unsaved-changes';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard
  implements CanDeactivate<CanExitWithUnsavedChanges>
{
  constructor(private modal: NzModalService) {} 

  canDeactivate(
    component: CanExitWithUnsavedChanges
  ): boolean | Observable<boolean> {
    if (component.hasUnsavedChanges()) {
      const modalRef: NzModalRef = this.modal.confirm({
        nzTitle: '¿Deseas salir sin guardar?',
        nzContent: 'Tienes cambios sin guardar. Si sales ahora, se perderán.',
        nzOkText: 'Salir sin guardar',
        nzOkDanger: true,
        nzOnOk: () => true,
        nzCancelText: 'Cancelar',
      });

      return modalRef.afterClose.pipe(
        map(result => {
          return result === true;
        })
      );

    }
    return true;
  }
}
