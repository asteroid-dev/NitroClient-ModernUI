import { Pipe, PipeTransform } from '@angular/core';
import { FriendlyTime } from '@nitrots/nitro-renderer';

@Pipe({ name: 'formatShort' })
export class FormatShortPipe implements PipeTransform
{
    public transform(seconds: number): string
    {
        return FriendlyTime.shortFormat(seconds);
    }
}
