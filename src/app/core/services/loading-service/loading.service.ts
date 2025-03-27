import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingMap = new Map<string, BehaviorSubject<boolean>>();

  getLoading(key: string): Observable<boolean> {
    if (!this.loadingMap.has(key)) {
      this.loadingMap.set(key, new BehaviorSubject<boolean>(false));
    }
    return this.loadingMap.get(key)!.asObservable();
  }

  setLoading(key: string, state: boolean): void {
    if (!this.loadingMap.has(key)) {
      this.loadingMap.set(key, new BehaviorSubject<boolean>(state));
    } else {
      this.loadingMap.get(key)!.next(state);
    }
  }
}
