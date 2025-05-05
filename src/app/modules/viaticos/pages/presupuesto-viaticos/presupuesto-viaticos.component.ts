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
import { NzButtonModule } from 'ng-zorro-antd/button';

interface PresupuestoRow {
  ASESOR: string;
  USUARIO: string;
  'CUPO MOVILIDAD': number;
  'CUPO HOSPEDAJE': number;
  'CUPO ALIMENTACION': number;
}

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
  ],
  templateUrl: './presupuesto-viaticos.component.html',
  styleUrl: './presupuesto-viaticos.component.less',
})
export class PresupuestoViaticosComponent implements OnInit {
  cicloSeleccionado: number | null = null;
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  constructor(
    private message: NzMessageService,
    private cicloState: CiclotateService
  ) {}

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

  currentStep = 0;
  archivoCargado = false;
  datosMock: PresupuestoRow[] = [];

  private readonly columnasEsperadas = [
    'ASESOR',
    'USUARIO',
    'CUPO MOVILIDAD',
    'CUPO HOSPEDAJE',
    'CUPO ALIMENTACION',
  ] as const;

  beforeUpload = (file: NzUploadFile): boolean => {
    if (
      !file.type ||
      ![
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ].includes(file.type)
    ) {
      this.message.error('Solo se permiten archivos .xlsx o .csv');
      return false;
    }

    this.leerArchivoComoArrayBuffer(file as unknown as File)
      .then((buffer) => {
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Leer los encabezados como matriz
        const filas: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });

        if (!Array.isArray(filas) || filas.length === 0) {
          this.message.error('El archivo está vacío o es inválido.');
          return;
        }

        const encabezados = filas[0] as string[];

        const columnasValidas = this.columnasEsperadas.every((col) =>
          encabezados.includes(col)
        );

        if (!columnasValidas) {
          this.message.error(
            'Formato incorrecto. Verifique las columnas del archivo.'
          );
          return;
        }

        // Si todo es correcto, convertir a objetos tipados
        const jsonData = XLSX.utils.sheet_to_json<PresupuestoRow>(sheet);

        this.datosMock = jsonData;
        this.archivoCargado = true;
        this.currentStep = 1;
        this.calcularTotales();
      })
      .catch((error) => {
        console.error('Error al procesar el archivo:', error);
        this.message.error('No se pudo procesar el archivo.');
      });

    return false;
  };

  private leerArchivoComoArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          resolve(result);
        } else {
          reject(new Error('El archivo no se pudo leer como ArrayBuffer.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  totalMovilidad = 0;
  totalHospedaje = 0;
  totalAlimentacion = 0;
  totalGeneral = 0;

  calcularTotales(): void {
    this.totalMovilidad = this.datosMock.reduce(
      (acc, row) => acc + (row['CUPO MOVILIDAD'] || 0),
      0
    );
    this.totalHospedaje = this.datosMock.reduce(
      (acc, row) => acc + (row['CUPO HOSPEDAJE'] || 0),
      0
    );
    this.totalAlimentacion = this.datosMock.reduce(
      (acc, row) => acc + (row['CUPO ALIMENTACION'] || 0),
      0
    );
    this.totalGeneral =
      this.totalMovilidad + this.totalHospedaje + this.totalAlimentacion;
  }

  cancelarCarga(): void {
    this.archivoCargado = false;
    this.currentStep = 0;
  }

  confirmarcarga(): void {
    this.currentStep = 2;
  }

}
