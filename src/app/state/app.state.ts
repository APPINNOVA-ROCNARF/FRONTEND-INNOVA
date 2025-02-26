import { ActionReducerMap } from '@ngrx/store';
import { uiReducer } from './ui/reducers';
import { UIState } from './ui/models';

/**
 * Definimos la estructura del estado global de la aplicación
 */
export interface AppState {
  ui: UIState;
}

/**
 * Reducers de cada feature state que se registrarán en NgRx
 */
export const reducers: ActionReducerMap<AppState> = {
  ui: uiReducer
};
