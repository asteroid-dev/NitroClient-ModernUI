import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[image-placeholder]'
})
export class ImagePlaceholderDirective implements OnInit
{
    constructor(private elementRef: ElementRef<HTMLImageElement>)
    {}

    public ngOnInit(): void
    {
        const element = this.elementRef.nativeElement;

        if(!element) return;

        element.onerror = () =>
        {
            element.src = '';

            element.onerror = null;
        };
    }
}
