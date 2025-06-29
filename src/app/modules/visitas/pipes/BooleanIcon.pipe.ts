import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'booleanIcon' })
export class BooleanIconPipe implements PipeTransform {
  transform(value: string) {
    const isTrue = value === 'TRUE';
    return {
      type: isTrue ? 'check' : 'close',
      color: isTrue ? 'green' : 'red'
    };
  }
}
export interface BooleanIcon { type: string; color: string; }