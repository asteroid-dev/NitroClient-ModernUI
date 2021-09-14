import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmojiPipe } from './emoji.pipe';

@Pipe({ name: 'roomChatFormatter', pure: false })
export class RoomChatFormatterPipe implements PipeTransform
{
    private _allowedColors: Map<string, string>;

    constructor(
        private _sanitizer: DomSanitizer,
        private _emojiPipe: EmojiPipe)
    {
        this._allowedColors = new Map();
        this._allowedColors.set('r', 'red');
        this._allowedColors.set('b', 'blue');
        this._allowedColors.set('g', 'green');
        this._allowedColors.set('y', 'yellow');
        this._allowedColors.set('w', 'white');
        this._allowedColors.set('o', 'orange');
        this._allowedColors.set('c', 'cyan');
        this._allowedColors.set('br', 'brown');
        this._allowedColors.set('pr', 'purple');
        this._allowedColors.set('pk', 'pink');

        this._allowedColors.set('red', 'red');
        this._allowedColors.set('blue', 'blue');
        this._allowedColors.set('green', 'green');
        this._allowedColors.set('yellow', 'yellow');
        this._allowedColors.set('white', 'white');
        this._allowedColors.set('orange', 'orange');
        this._allowedColors.set('cyan', 'cyan');
        this._allowedColors.set('brown', 'brown');
        this._allowedColors.set('purple', 'purple');
        this._allowedColors.set('pink', 'pink');
    }

    public transform(content: string): SafeHtml
    {
        let result = '';

        content = content.replace(/<[^>]*>/g, '');
        content = this._emojiPipe.transform(content);

        if(content.startsWith('@') && content.indexOf('@', 1) > -1)
        {
            let match = null;

            while((match = /@[a-zA-Z]+@/g.exec(content)) !== null)
            {
                const colorTag = match[0].toString();
                const colorName = colorTag.substr(1, colorTag.length - 2);
                const text = content.replace(colorTag, '');

                if(!this._allowedColors.has(colorName))
                {
                    result = text;
                }
                else
                {
                    const color = this._allowedColors.get(colorName);
                    result = '<span style="color: ' + color + '">' + text + '</span>';
                }
                break;
            }
        }
        else
        {
            result = content;
        }

        return this._sanitizer.bypassSecurityTrustHtml(result);
    }
}
