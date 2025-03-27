import { TemplateRef } from '@angular/core';

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | string;
  renderFn?: TemplateRef<{ $implicit: T; column: TableColumn<T> }>;
}
