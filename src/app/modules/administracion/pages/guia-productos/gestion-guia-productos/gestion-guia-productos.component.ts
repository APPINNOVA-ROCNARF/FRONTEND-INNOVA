import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TablaGuiasProductoComponent } from '../../../components/guias-producto/tabla-guias-producto/tabla-guias-producto.component';
import { GuiaProducto } from '../../../interfaces/guias-api-response';
import { GuiaProductoStateService } from '../../../services/guias-producto/guias-state.service';
import { CommonModule } from '@angular/common';
import { GuiaProductoService } from '../../../services/guias-producto/guias.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FiltrosGuiasProductosComponent } from "../../../components/guias-producto/filtros-guias-productos/filtros-guias-productos.component";

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
    FiltrosGuiasProductosComponent
],
  templateUrl: './gestion-guia-productos.component.html',
  styleUrl: './gestion-guia-productos.component.less',
})
export class GestionGuiaProductosComponent implements OnInit {
  guias!: Signal<GuiaProducto[]>;
  loadingGuias!: Signal<boolean>;

  sortFns: Record<string, (a: GuiaProducto, b: GuiaProducto) => number> = {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private guiasState: GuiaProductoStateService,
    private guiasService: GuiaProductoService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.guias = this.guiasState.guias;
    this.loadingGuias = this.guiasState.getGuiasLoading();

    this.guiasState.fetchGuias();

    this.sortFns[`marca`] = (a, b) =>
      String(a[`marca`] ?? '').localeCompare(
        String(b[`marca`] ?? '')
      );

        this.sortFns[`nombre`] = (a, b) =>
      String(a[`nombre`] ?? '').localeCompare(
        String(b[`nombre`] ?? '')
      );

        this.sortFns['fuerza'] = (a, b) => {
      const numA = parseInt(a.fuerza?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.fuerza?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    };
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
}
