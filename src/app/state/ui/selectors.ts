import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UIState } from './models';

export const selectUIState = createFeatureSelector<UIState>('ui');

export const selectSidebarState = createSelector(
  selectUIState,
  (state) => state.isSidebarCollapsed
);
