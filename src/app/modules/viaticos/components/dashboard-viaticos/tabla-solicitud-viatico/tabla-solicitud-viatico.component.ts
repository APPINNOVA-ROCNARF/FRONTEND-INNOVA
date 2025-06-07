import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SolicitudViatico } from '../../../interfaces/viatico-api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { EstadoViaticoPipe } from '../../../pipes/estado-viatico.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';
import { UsuarioAppSelect } from '../../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-tabla-solicitud-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    NzTagModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    EstadoViaticoPipe,
    NzTableModule,
    NzButtonModule,
    NzSelectModule,
    NzDividerModule
  ],
  templateUrl: './tabla-solicitud-viatico.component.html',
  styleUrl: './tabla-solicitud-viatico.component.less',
})
export class TablaSolicitudViaticoComponent implements OnInit {
  @Input() data: SolicitudViatico[] = [];
  @Input() loading = false;

  @Input() sortFns: Record<
    string,
    (a: SolicitudViatico, b: SolicitudViatico) => number
  > = {};

  // Asesores

  @Input() representantes$!: Observable<UsuarioAppSelect[]>;
  representanteOptions: { label: string; value: string }[] = [];
  @Input() representantesSeleccionados: string[] = [];
  @Output() representantesSeleccionadosChange = new EventEmitter<string[]>();

  // Estados
  @Input() estadosSeleccionados: string[] = [];
  estados = ['Borrador', 'En revisión', 'Aprobado', 'Devuelto', 'Rechazado'];
  @Output() estadoChange = new EventEmitter<string[]>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.representantes$.subscribe((lista) => {
      this.representanteOptions = lista.map((r) => ({
        label: r.nombre,
        value: r.nombre,
      }));
    });
  }

  editarViatico(item: SolicitudViatico): void {
    const id = item?.id || item?.id;
    if (id != null) {
      this.router.navigate(['detalle', id], { relativeTo: this.route });
    }
  }

  emitirRepresentantesSeleccionados() {
    this.representantesSeleccionadosChange.emit(
      this.representantesSeleccionados
    );
  }

   emitirEstadosSeleccionados(): void {
    this.estadoChange.emit(this.estadosSeleccionados);
  }
}
