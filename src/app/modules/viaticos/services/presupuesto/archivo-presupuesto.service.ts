import { Injectable } from "@angular/core";
import { PresupuestoRow } from "../../interfaces/presupuesto-data";
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ArchivoPresupuestoService {
  private readonly columnasEsperadas = [
    'SECTOR',
    'CUPO MOVILIDAD',
    'CUPO HOSPEDAJE',
    'CUPO ALIMENTACION',
  ] as const;

  private readonly tiposPermitidos = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  validarTipo(file: File): boolean {
    return !!file.type && this.tiposPermitidos.includes(file.type);
  }

  async procesar(file: File): Promise<PresupuestoRow[]> {
    const buffer = await this.leerArchivoComoArrayBuffer(file);
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

    if (!Array.isArray(filas) || filas.length === 0) {
      throw new Error('El archivo está vacío o es inválido.');
    }

    const encabezados = filas[0] as string[];
    if (!this.validarEncabezados(encabezados)) {
      throw new Error('Las columnas del archivo no son válidas.');
    }

    return XLSX.utils.sheet_to_json<PresupuestoRow>(sheet).map(row => ({
      ...row,
      SECTOR: String(row['SECTOR'])
    }));
  }

  private validarEncabezados(encabezados: string[]): boolean {
    return this.columnasEsperadas.every((col) => encabezados.includes(col));
  }

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
}
