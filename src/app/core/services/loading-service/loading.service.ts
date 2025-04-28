import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingMap = signal(new Map<string, boolean>());

  getLoading(key: string) {
    return computed(() => this.loadingMap().get(key) ?? false);
  }

  setLoading(key: string, state: boolean): void {
    const updated = new Map(this.loadingMap());
    updated.set(key, state);
    this.loadingMap.set(updated);
  }
}
