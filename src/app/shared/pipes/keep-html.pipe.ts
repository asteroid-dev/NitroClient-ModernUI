import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'keepHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform
{
    constructor(private _sanitizer: DomSanitizer)
    {}

    public transform(content: string): SafeHtml
    {
        return this._sanitizer.bypassSecurityTrustHtml(content);
    }
}