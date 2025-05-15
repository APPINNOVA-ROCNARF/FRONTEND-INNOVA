import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoriaColor'
})
export class CategoriaColorPipe implements PipeTransform {

  transform(categoria: string): string {
    switch (categoria) {
      case 'Movilización':
        return 'red';
      case 'Alimentación':
        return 'purple';
      case 'Hospedaje':
        return 'cyan';
      default:
        return 'default';
    }
  }

}
