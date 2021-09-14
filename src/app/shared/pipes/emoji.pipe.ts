import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as joypixels from 'emoji-toolkit';

@Pipe({ name: 'nitroEmoji', pure: false })
export class EmojiPipe implements PipeTransform
{
    constructor(private _sanitizer: DomSanitizer)
    {}

    public transform(content: string): string
    {
        return (joypixels.shortnameToUnicode(content) as string);
    }
}