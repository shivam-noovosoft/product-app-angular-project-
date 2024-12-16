import {PipeTransform,Pipe} from '@angular/core';

@Pipe({
  standalone:true,
  name:'ellipses'
})
export class Ellipses  implements PipeTransform {
  transform(value:string,): string {
    return value.slice(0,25)+'....'
  }
}
