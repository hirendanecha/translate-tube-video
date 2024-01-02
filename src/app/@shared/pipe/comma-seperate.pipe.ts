import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeperate',
  pure: true
})
export class CommaSeperatePipe implements PipeTransform {

  transform(value: string):any {
    if(!value){
      return null
    }
    return value.split(',').join(', ');
  }

}
