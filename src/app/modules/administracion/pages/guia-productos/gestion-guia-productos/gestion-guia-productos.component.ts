import { Component, computed, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TablaGuiasProductoComponent } from '../../../components/guias-producto/tabla-guias-producto/tabla-guias-producto.component';
import {
  GuiaProducto,
  SelectItemDTO,
} from '../../../interfaces/guias-api-response';
import { GuiaProductoStateService } from '../../../services/guias-producto/guias-state.service';
import { CommonModule } from '@angular/common';
import { GuiaProductoService } from '../../../services/guias-producto/guias.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FiltrosGuiasProductosComponent } from '../../../components/guias-producto/filtros-guias-productos/filtros-guias-productos.component';
import { Observable } from 'rxjs';
import { FuerzaStateService } from '../../../../../shared/services/fuerzas-service/fuerza-state.service';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import FileSaver from 'file-saver';
import ExcelJS from 'exceljs';

@Component({
  selector: 'app-gestion-guia-productos',
  standalone: true,
  imports: [
    NzTypographyModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    TablaGuiasProductoComponent,
    CommonModule,
    FiltrosGuiasProductosComponent,
  ],
  templateUrl: './gestion-guia-productos.component.html',
  styleUrl: './gestion-guia-productos.component.less',
})
export class GestionGuiaProductosComponent implements OnInit {
  guias!: Signal<GuiaProducto[]>;
  loadingGuias!: Signal<boolean>;

  sortFns: Record<string, (a: GuiaProducto, b: GuiaProducto) => number> = {};

  nombres!: Signal<SelectItemDTO[]>;
  marcas!: Signal<SelectItemDTO[]>;
  loading$!: Observable<boolean>;

  filtrosTexto = signal<{
    nombreTexto: string[] | null;
    marcaTexto: string[] | null;
    fuerzasTexto: string[] | null;
    estadoTexto: 'activo' | 'inactivo' | 'todos' | null;
  }>({
    nombreTexto: null,
    marcaTexto: null,
    fuerzasTexto: null,
    estadoTexto: 'todos',
  });

  fuerzas$!: Observable<FuerzaSelectDTO[]>;
  fuerzasLoading$!: Signal<boolean>;

  isExporting = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private guiasState: GuiaProductoStateService,
    private guiasService: GuiaProductoService,
    private fuerzaState: FuerzaStateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.guias = this.guiasState.guias;
    this.loadingGuias = this.guiasState.getGuiasLoading();

    this.guiasState.fetchGuias();

    this.sortFns[`marca`] = (a, b) =>
      String(a[`marca`] ?? '').localeCompare(String(b[`marca`] ?? ''));

    this.sortFns[`nombre`] = (a, b) =>
      String(a[`nombre`] ?? '').localeCompare(String(b[`nombre`] ?? ''));

    this.sortFns['fuerza'] = (a, b) => {
      const numA = parseInt(a.fuerza?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.fuerza?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    };

    // Selects
    this.nombres = this.guiasState.guiaNombre;
    this.marcas = this.guiasState.guiaMarca;

    this.guiasState.fetchGuiaSelect();

    // Fuerza

    this.fuerzas$ = this.fuerzaState.fuerzas$;
    this.fuerzasLoading$ = this.fuerzaState.getFuerzasLoading();
    this.fuerzaState.fetchFuerzas();
  }

  eliminarGuia(id: number): void {
    this.guiasService.eliminarGuia(id).subscribe({
      next: () => {
        this.message.success('Guía eliminada correctamente');
        this.guiasState.fetchGuias(true);
      },
      error: () => this.message.error('Error al eliminar la guía'),
    });
  }

  guiasFiltradas = computed(() => {
    const todas = this.guias();
    const { nombreTexto, marcaTexto, fuerzasTexto, estadoTexto } =
      this.filtrosTexto();

    return todas.filter((guia) => {
      const coincideNombre =
        !nombreTexto ||
        nombreTexto.length === 0 ||
        nombreTexto.includes(guia.nombre ?? '');

      const coincideMarca =
        !marcaTexto ||
        marcaTexto.length === 0 ||
        marcaTexto.includes(guia.marca ?? '');

      const coincideFuerza =
        !fuerzasTexto ||
        fuerzasTexto.length === 0 ||
        fuerzasTexto.includes(guia.fuerza ?? '');

      const coincideEstado =
        !estadoTexto ||
        estadoTexto === 'todos' ||
        (estadoTexto === 'activo' && guia.activo === true) ||
        (estadoTexto === 'inactivo' && guia.activo === false);

      return (
        coincideNombre && coincideMarca && coincideFuerza && coincideEstado
      );
    });
  });

  aplicarFiltros(filtros: {
    nombreTexto: string[] | null;
    marcaTexto: string[] | null;
    fuerzasTexto: string[] | null;
    estadoTexto: 'activo' | 'inactivo' | 'todos' | null;
  }) {
    this.filtrosTexto.set(filtros);
  }

  exportarGuiasExcel(): void {
  if (this.isExporting) return;
  const data = this.guiasFiltradas();
  if (!data || data.length === 0) {
    this.message.warning('No hay datos para exportar.');
    return;
  }

  this.isExporting = true;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Guías de Productos');

  // Encabezados
  worksheet.addRow(['Marca', 'Nombre', 'Fuerza', 'Estado']);

  // Datos
  for (const guia of data) {
    worksheet.addRow([
      guia.marca ?? '',
      guia.nombre ?? '',
      guia.fuerza ?? '',
      guia.activo ? 'Activo' : 'Inactivo',
    ]);
  }

  // Estilo opcional: ancho y negrita en header
  worksheet.columns.forEach((col) => (col.width = 20));
  worksheet.getRow(1).font = { bold: true };

  // Nombre de archivo con fecha
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const nombreArchivo = `GuiasProductos_${yyyy}-${mm}-${dd}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    FileSaver.saveAs(new Blob([buffer]), nombreArchivo);
    this.message.success(`Archivo exportado con éxito: ${nombreArchivo}`);
  }).catch((error) => {
    console.error('Error al exportar:', error);
    this.message.error('Error al exportar archivo');
  }).finally(() => {
    this.isExporting = false;
  });
}

}
