import { createAction } from '@ngrx/store';

export const toggleSidebar = createAction('[UI] Toggle Sidebar');
export const collapseSidebar = createAction('[UI] Collapse Sidebar');
export const expandSidebar = createAction('[UI] Expand Sidebar');
