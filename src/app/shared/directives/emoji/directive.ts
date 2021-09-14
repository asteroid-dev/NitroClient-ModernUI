import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import * as joypixels from 'emoji-toolkit';

@Directive({
    selector: '[nitro-emoji]'
})
export class EmojiDirective implements AfterViewInit
{
    constructor(private elementRef: ElementRef)
    {}

    public ngAfterViewInit(): void
    {
        const element = (this.elementRef.nativeElement as HTMLElement);

        if(!element) return;

        const converted = joypixels.shortnameToImage(element.innerHTML);

        element.innerHTML = converted;
    }
}