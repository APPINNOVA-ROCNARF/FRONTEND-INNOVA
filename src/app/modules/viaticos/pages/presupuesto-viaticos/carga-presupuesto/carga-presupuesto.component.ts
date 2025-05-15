import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import type { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ArchivoPresupuestoService } from '../../../services/presupuesto/archivo-presupuesto.service';
import { CupoMensualStateService } from '../../../services/presupuesto/cupoMensual-state.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-presupuesto-viaticos',
  standalone: true,
  imports: [
    NzCardModule,
    NzUploadModule,
    NzIconModule,
    NzSelectModule,
    NzStepsModule,
    CommonModule,
    FormsModule,
    NzTableModule,
    NzResultModule,
    NzTypographyModule,
    NzDividerModule,
    NzButtonModule,
    NzSpinModule,
    NzModalModule
  ],
  templateUrl: './carga-presupuesto.component.html',
  styleUrl: './carga-presupuesto.component.less',
})
export class PresupuestoViaticosComponent implements OnInit {
  cicloSeleccionado: number | null = null;
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;
  readonly currentStep = computed(() => {
    switch (this.presupuestoState.estadoCarga$()) {
      case 'inicio':
        return 0;
      case 'archivoCargado':
        return 1;
      case 'confirmacion':
        return 2;
      case 'completado':
        return 3;
      default:
        return 0;
    }
  });

  private yaCargadoEffect = effect(() => {
    if (this.presupuestoState.CuposCargados$()) {
      this.presupuestoState.setEstadoCarga('completado');
    }
  });

  constructor(
    public presupuestoState: CupoMensualStateService,
    private message: NzMessageService,
    private cicloState: CiclotateService,
    private archivoService: ArchivoPresupuestoService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {


    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) => {
        const cicloActivo = ciclos.find((c) => c.estado);
        if (cicloActivo) {
          this.presupuestoState.setCiclo(cicloActivo.id);
        }

        return ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }));
      })
    );

    effect(() => {
      if (this.presupuestoState.datos$().length && this.presupuestoState.estadoCarga$() === 'inicio') {
        this.presupuestoState.setEstadoCarga('archivoCargado');
      }
    });

    effect(() => {
      if (this.presupuestoState.resultado$()) {
        this.presupuestoState.setEstadoCarga('completado');
      }
    });
  }

  get subtituloResultado(): string | undefined {
    const resultado = this.presupuestoState.resultado$();
    if (!resultado) return undefined;
    return resultado.cuposInsertados > 0
      ? `Cupos insertados: ${resultado.cuposInsertados}`
      : undefined;
  }


  beforeUpload = (file: NzUploadFile): boolean => {
    const archivo = file as unknown as File;

    if (!this.archivoService.validarTipo(archivo)) {
      this.message.error('Solo se permiten archivos .xlsx o .csv');
      return false;
    }

    this.archivoService.procesar(archivo)
      .then((data) => {
        this.presupuestoState.setDatos(data);
        console.log(data);
        this.presupuestoState.setEstadoCarga('archivoCargado');
      })
      .catch((error) => {
        this.message.error(error.message || 'No se pudo procesar el archivo.');
      });

    return false;
  };


  cancelarCarga(): void {
    this.presupuestoState.reset();
    this.presupuestoState.setEstadoCarga('inicio');
  }

  confirmarcarga(): void {
    if (!this.presupuestoState.cicloSeleccionado$() || this.presupuestoState.datos$().length === 0) {
      this.message.warning("Debe seleccionar un periodo y cargar un archivo.");
      return;
    }

    this.modal.confirm({
      nzTitle: '¿Desea confirmar la carga del presupuesto?',
      nzContent: 'Esta acción reemplazará los cupos existentes para el ciclo seleccionado.',
      nzOkText: 'Sí, cargar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.presupuestoState.setEstadoCarga('completado');
        this.presupuestoState.cargarCupos();
      }
    });
  }

}
