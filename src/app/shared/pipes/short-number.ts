import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform
{

    transform(number: number, args?: any): any
    {
        if(isNaN(number)) return 0;

        if(number === null) return 0;

        if(number === 0) return 0;


        return number.toLocaleString('en-US', {maximumFractionDigits:2});
    }
}
