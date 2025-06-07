import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioAppSelect } from '../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros-cobertura-medicos',
  standalone: true,
  imports: [NzCollapseModule, NzSelectModule, CommonModule, FormsModule],
  templateUrl: './filtros-cobertura-medicos.component.html',
  styleUrl: './filtros-cobertura-medicos.component.less',
})
export class FiltrosCoberturaMedicosComponent implements OnInit {
  // Representantes
  @Input() representantes$!: Observable<UsuarioAppSelect[]>;
  representanteOptions: { label: string; value: string }[] = [];
  @Input() representantesSeleccionados: string[] = [];
  @Output() representantesSeleccionadosChange = new EventEmitter<string[]>();

  // Secciones
  @Input() secciones$!: Observable<SeccionesSelect[]>;
  seccionesOptions: { label: string; value: string }[] = [];
  @Input() seccionesSeleccionadas: string[] = [];
  @Output() seccionesSeleccionadasChange = new EventEmitter<string[]>();

  // Regiones
  @Input() regionesSeleccionadas: string[] = [];
  regiones = ['COSTA', 'SIERRA', 'AUSTRO'];
  @Output() regionesChange = new EventEmitter<string[]>();


  ngOnInit(): void {
    this.representantes$.subscribe((lista) => {
      this.representanteOptions = lista.map((r) => ({
        label: r.nombre,
        value: r.nombre,
      }));
    });

    this.secciones$.subscribe((lista) => {
      this.seccionesOptions = lista.map((r) => ({
        label: r.codigo,
        value: r.codigo,
      }));
    });
  }

  emitirRepresentantesSeleccionados() {
    this.representantesSeleccionadosChange.emit(
      this.representantesSeleccionados
    );
  }

  emitirRegionesSeleccionadas(): void {
    this.regionesChange.emit(this.regionesSeleccionadas);
  }

  emitirSeccionesSeleccionadas(): void {
    this.seccionesSeleccionadasChange.emit(this.seccionesSeleccionadas);
  }
}
