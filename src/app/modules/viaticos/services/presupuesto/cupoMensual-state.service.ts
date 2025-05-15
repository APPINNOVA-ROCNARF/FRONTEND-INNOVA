import { computed, Injectable, signal } from "@angular/core";
import { CargarCupoResponse, PresupuestoRow } from "../../interfaces/presupuesto-data";
import { CupoMensualService } from "./cupoMensual.service";

@Injectable({ providedIn: 'root' })
export class CupoMensualStateService {
  private cicloSeleccionado = signal<number | null>(null);
  readonly cicloSeleccionado$ = this.cicloSeleccionado.asReadonly();

  private datos = signal<PresupuestoRow[]>([]);
  readonly datos$ = this.datos.asReadonly();

  private loading = signal(false);
  readonly loading$ = this.loading.asReadonly();

  private resultado = signal<CargarCupoResponse | null>(null);
  readonly resultado$ = this.resultado.asReadonly();

  private CuposCargados = signal(false);
  readonly CuposCargados$ = this.CuposCargados.asReadonly();

  private estadoCarga = signal<'inicio' | 'archivoCargado' | 'confirmacion' | 'completado'>('inicio');
  readonly estadoCarga$ = this.estadoCarga.asReadonly();

  setEstadoCarga(nuevoEstado: 'inicio' | 'archivoCargado' | 'confirmacion' | 'completado') {
  this.estadoCarga.set(nuevoEstado);
}

  constructor(private cupoService: CupoMensualService) { }

  setCiclo(id: number) {
    this.cicloSeleccionado.set(id);
    this.resetResultado();
    this.estadoCarga.set('inicio');

    if (id !== null) {
      this.verificarCargaCiclo(id);
    }
  }

  private resetResultado() {
    this.resultado.set(null);
    this.CuposCargados.set(false);
  }

  setDatos(data: PresupuestoRow[]) {
    this.datos.set(data);
  }

  reset() {
    this.datos.set([]);
    this.loading.set(false);
    this.resultado.set(null);
  }

  readonly totalMovilidad = computed(() =>
    this.datos().reduce((acc, row) => acc + (row['CUPO MOVILIDAD'] || 0), 0)
  );

  readonly totalHospedaje = computed(() =>
    this.datos().reduce((acc, row) => acc + (row['CUPO HOSPEDAJE'] || 0), 0)
  );

  readonly totalAlimentacion = computed(() =>
    this.datos().reduce((acc, row) => acc + (row['CUPO ALIMENTACION'] || 0), 0)
  );

  readonly totalGeneral = computed(() =>
    this.totalMovilidad() + this.totalHospedaje() + this.totalAlimentacion()
  );

  cargarCupos() {
    const ciclo = this.cicloSeleccionado();
    const datos = this.datos();

    if (!ciclo || !datos.length) return;

    this.loading.set(true);

    this.cupoService.cargarCupos(ciclo, datos).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.datos.set([]);
      },
      error: () => {
        this.resultado.set({
          mensaje: 'Error al cargar cupos',
          cuposInsertados: 0,
          sectoresNoEncontrados: []
        });
      },
      complete: () => this.loading.set(false)
    });
  }

  verificarCargaCiclo(cicloId: number): void {
    this.cupoService.verificarCupos(cicloId).subscribe({
      next: (res) => {
        const yaFueCargado = res.status === 200;
        this.CuposCargados.set(yaFueCargado);

        if (yaFueCargado) {
          this.resultado.set({
            mensaje: 'Este ciclo ya tiene cupos registrados.',
            cuposInsertados: 0,
            sectoresNoEncontrados: []
          });

          this.datos.set([]);
          this.loading.set(false);
          this.estadoCarga.set('completado');
        }
      },
      error: () => {
        this.CuposCargados.set(false);
        this.estadoCarga.set('inicio');
      }
    });
  }
}
