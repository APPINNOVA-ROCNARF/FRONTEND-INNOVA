import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticaSolicitudViatico } from '../../../interfaces/viatico-api-response';
import { TotalSolicitudViaticoComponent} from '../total-solicitud-viatico/total-solicitud-viatico.component';
import { EstadoSolicitudViaticoComponent } from '../estado-solicitud-viatico/estado-viaticos.component';
import { EstadoCicloComponent } from '../estado-ciclo/estado-ciclo.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';

interface camposEstado{
  nombre: string,
  monto: number,
  color: string,
}
@Component({
  selector: 'app-estadistica-solicitud-viatico',
  standalone: true,
  imports: [
    CommonModule,
    TotalSolicitudViaticoComponent,
    EstadoSolicitudViaticoComponent,
    EstadoCicloComponent,
    NzGridModule,
    NzSpinModule,
  ],
  templateUrl: './estadistica-solicitud-viatico.component.html',
  styleUrl: './estadistica-solicitud-viatico.component.less',
})
export class EstadisticaSolicitudViaticoComponent {
  @Input() estadistica: EstadisticaSolicitudViatico | null = null;

  // Getters reactivos
  get totalViaticos(): number {
    return this.estadistica?.total_monto ?? 0;
  }

  get totalRegistros(): number {
    return this.estadistica?.total_solicitudes ?? 0;
  }

  get distribucionEstado(): camposEstado[] {
    return [
      {
        nombre: 'En revisión',
        monto: this.estadistica?.total_en_revision ?? 0,
        color: '#8ecaff',
      },
      {
        nombre: 'Aprobado',
        monto: this.estadistica?.total_aprobado ?? 0,
        color: '#B7EB8F',
      },
      {
        nombre: 'Rechazado',
        monto: this.estadistica?.total_rechazado ?? 0,
        color: '#FFA39E',
      },
    ];
  }

  get distribucionCategoria(): camposEstado[] {
    return [
      {
        nombre: 'Movilización',
        monto: this.estadistica?.monto_movilizacion ?? 0,
        color: '#ef8b83',
      },
      {
        nombre: 'Hospedaje',
        monto: this.estadistica?.monto_hospedaje ?? 0,
        color: '#87E8DE',
      },
      {
        nombre: 'Alimentación',
        monto: this.estadistica?.monto_alimentacion ?? 0,
        color: '#c082ed',
      },
    ];
  }

  get porcentajeCiclo(): number {
    const total =
      (this.estadistica?.cantidad_aprobado ?? 0) +
      (this.estadistica?.cantidad_en_revision ?? 0) +
      (this.estadistica?.cantidad_rechazado ?? 0);
    const completados =
      (this.estadistica?.cantidad_aprobado ?? 0) +
      (this.estadistica?.cantidad_rechazado ?? 0);
    return total > 0 ? Math.round((completados / total) * 100) : 0;
  }

  get successCiclo(): number {
    const total =
      (this.estadistica?.cantidad_aprobado ?? 0) +
      (this.estadistica?.cantidad_en_revision ?? 0) +
      (this.estadistica?.cantidad_rechazado ?? 0);
    return total > 0
      ? Math.round(((this.estadistica?.cantidad_aprobado ?? 0) / total) * 100)
      : 0;
  }

  get tooltipCiclo(): string {
    const enRevision = this.estadistica?.cantidad_en_revision ?? 0;
    const aprobado = this.estadistica?.cantidad_aprobado ?? 0;
    const rechazado = this.estadistica?.cantidad_rechazado ?? 0;
    return `${aprobado} aprobados / ${enRevision} en revisión / ${rechazado} rechazados`;
  }

  get estadoTextoCiclo(): string {
    const total =
      (this.estadistica?.cantidad_en_revision ?? 0) +
      (this.estadistica?.cantidad_aprobado ?? 0) +
      (this.estadistica?.cantidad_rechazado ?? 0);
    const aprobados = this.estadistica?.cantidad_aprobado ?? 0;
    if (total > 0 && aprobados === total) {
      return 'Ciclo Completo';
    }
    return 'Ciclo en proceso';
  }

  get estadoTextoColor(): string {
    const total =
      (this.estadistica?.cantidad_en_revision ?? 0) +
      (this.estadistica?.cantidad_aprobado ?? 0) +
      (this.estadistica?.cantidad_rechazado ?? 0);
    const aprobados = this.estadistica?.cantidad_aprobado ?? 0;
    if (total > 0 && aprobados === total) {
      return 'green';
    }
    return 'blue';
  }
}
