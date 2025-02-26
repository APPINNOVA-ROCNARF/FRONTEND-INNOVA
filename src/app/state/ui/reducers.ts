import { createReducer, on } from '@ngrx/store';
import { UIState, initialUIState } from './models';
import { toggleSidebar, collapseSidebar, expandSidebar } from './actions';

export const uiReducer = createReducer(
  initialUIState,
  on(toggleSidebar, (state) => ({ ...state, isSidebarCollapsed: !state.isSidebarCollapsed })),
  on(collapseSidebar, (state) => ({ ...state, isSidebarCollapsed: true })),
  on(expandSidebar, (state) => ({ ...state, isSidebarCollapsed: false }))
);
