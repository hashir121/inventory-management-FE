import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number | null | undefined): unknown {
    if (value == null || isNaN(value)) {
      return '$0.00';
    }
    return `$${value.toFixed(2)}`;
  }

}
