import { Pipe, PipeTransform, Inject, Injector } from '@angular/core';

@Pipe({
  name: 'dynamicPipe',
  pure: true
})
export class DynamicPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: any, pipeName: string, pipeArgs: any[] = []): any {
    if (!pipeName) return value;

    const pipe = this.injector.get<any>(pipeName as any, null);
    if (!pipe || !pipe.transform) return value;

    return pipe.transform(value, ...pipeArgs);
  }
}
