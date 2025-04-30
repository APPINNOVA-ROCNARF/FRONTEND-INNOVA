import { Component, OnInit, Signal } from '@angular/core';
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
import { CicloSelectDTO } from '../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import type { NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';

interface PresupuestoRow {
  Nombre: string;
  Categoria: string;
  Monto: number;
}

@Component({
  selector: 'app-presupuesto-viaticos',
  standalone: true,
  imports: [NzCardModule, NzUploadModule, NzIconModule, NzSelectModule, NzStepsModule, CommonModule, FormsModule, NzTableModule, NzResultModule, NzTypographyModule, NzDividerModule],
  templateUrl: './presupuesto-viaticos.component.html',
  styleUrl: './presupuesto-viaticos.component.less'
})
export class PresupuestoViaticosComponent implements OnInit {

  cicloSeleccionado: number | null = null;
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;


  constructor(private message: NzMessageService, private cicloState: CiclotateService) { }


  ngOnInit(): void {
    this.cargarCiclos();
  }

  cargarCiclos(): void {
    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) => {
        const cicloActivo = ciclos.find((c) => c.estado);
        if (cicloActivo) {
          this.cicloSeleccionado = cicloActivo.id;
        }

        return ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }));
      })
    );
  }

  currentStep = 1;
  archivoCargado = false;
  datosMock: PresupuestoRow[] = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet) as PresupuestoRow[];
  
      this.datosMock = jsonData;
      this.archivoCargado = true;
    };
    reader.readAsArrayBuffer(file as any as File);
    return false;
  };


  cancelarCarga(): void {
    this.archivoCargado = false;
    // Opcional: limpiar datos previos
    // this.datosMock = [];
  }
}
