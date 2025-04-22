import { TemplateRef } from '@angular/core';

import {
  NzTableFilterList,
  NzTableFilterFn,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | string;
  renderFn?: TemplateRef<{ $implicit: T; column: TableColumn<T> }>;
  formatFn?: (value: any) => string;
  nzFilters?: NzTableFilterList;
  nzFilterFn?: boolean | NzTableFilterFn<T>;
  nzSortFn?: boolean | NzTableSortFn<T>;
  defaultSortOrder?: NzTableSortOrder;
}
