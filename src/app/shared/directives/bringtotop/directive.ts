import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';

@Directive({
    selector: '[bringToTop]'
})
export class BringToTopDirective implements AfterViewInit, OnDestroy
{
    private static TOP_TARGETS: HTMLElement[] = [];
    private static Z_INDEX_START: number = 400;
    private static Z_INDEX_INCREASE: number = 1;

    private target: HTMLElement = null;

    @Input()
    public bringToTop: string;

    constructor(
        private elementRef: ElementRef,
        private ngZone: NgZone)
    {
        this.bringToFront = this.bringToFront.bind(this);
    }

    public ngAfterViewInit(): void
    {
        const element = (this.elementRef.nativeElement as HTMLElement);

        if(!element) return;

        this.target = element;

        this.addTarget();
        this.registerEvents();
        this.bringToFront();
    }

    public ngOnDestroy(): void
    {
        this.unregisterEvents();
        this.removeTarget();
        this.bringToFront();
    }

    private addTarget(): void
    {
        if(!this.target) return;

        const index = BringToTopDirective.TOP_TARGETS.indexOf(this.target);

        if(index >= 0) return;

        BringToTopDirective.TOP_TARGETS.push(this.target);
    }

    private removeTarget(): void
    {
        if(!this.target) return;

        const index = BringToTopDirective.TOP_TARGETS.indexOf(this.target);

        if(index === -1) return;

        BringToTopDirective.TOP_TARGETS.splice(index, 1);
    }

    private registerEvents(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(!this.target) return;

            this.target.addEventListener('mousedown', this.bringToFront);
        });
    }

    private unregisterEvents(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(!this.target) return;

            this.target.removeEventListener('mousedown', this.bringToFront);
        });
    }

    private bringToFront(event: MouseEvent = null): void
    {
        this.moveTarget();

        let zIndex = BringToTopDirective.Z_INDEX_START;

        for(const target of BringToTopDirective.TOP_TARGETS)
        {
            if(!target) continue;

            zIndex = (zIndex + BringToTopDirective.Z_INDEX_INCREASE);

            target.style.zIndex = (zIndex.toString());
        }
    }

    private moveTarget(): void
    {
        const index = BringToTopDirective.TOP_TARGETS.indexOf(this.target);

        if(index === -1) return;

        const deleted = BringToTopDirective.TOP_TARGETS.splice(index, 1);

        BringToTopDirective.TOP_TARGETS.push(...deleted);
    }

    private isTopTarget(): boolean
    {
        if(!this.target) return false;

        const index = BringToTopDirective.TOP_TARGETS.indexOf(this.target);

        if((index === -1) || (index < (BringToTopDirective.TOP_TARGETS.length - 1))) return false;

        return true;
    }
}