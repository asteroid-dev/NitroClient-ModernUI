import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uniqueNumber' })
export class UniqueNumberPipe implements PipeTransform
{
    public transform(number: number): string
    {
        const numbers = number.toString().split('');

        let result = '';

        for(let i = 0; i < numbers.length; i++)
        {
            result = result + '<i class="unique-number n-' + numbers[i] + '"></i>';
        }

        return result;
    }
}
