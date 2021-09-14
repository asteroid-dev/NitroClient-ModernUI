import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy
{
    private static POS_MEMORY = new Map();
    private static BOUNDS_THRESHOLD_TOP = 0;
    private static BOUNDS_THRESHOLD_LEFT = 0;

    @Input()
    public dragHandle: string = '.drag-handler';

    @Input()
    public dragTarget: string;

    @Input()
    public center: boolean = false;

    @Input()
    public topCenter: boolean = true;

    @Input()
    public noMemory: boolean = false;

    private _name: string           = null;
    private _target: HTMLElement    = null;
    private _handle: HTMLElement    = null;
    private _isDragging: boolean    = false;
    private _delta                  = { x: 0, y: 0 };
    private _offset                 = { x: 0, y: 0 };
    private _destroy                = new Subject<void>();

    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _elementRef: ElementRef<HTMLDivElement>,
        private _ngZone: NgZone)
    {}

    public ngAfterViewInit(): void
    {
        this._name = this._viewContainerRef['_hostTNode']['classesWithoutHost'];

        const element = (this._elementRef.nativeElement as HTMLElement);

        if(!element) return;

        this._handle = this.dragHandle ? element.querySelector(this.dragHandle) : element;
        this._target = this.dragTarget ? element.querySelector(this.dragTarget) : element;

        if(this._handle)
        {
            this._handle.classList.add('header-draggable');

            this._handle.parentElement.classList.add('header-draggable');
        }

        if(this.topCenter)
        {
            element.style.top = '50px';
            element.style.left = `calc(50vw - ${ (element.offsetWidth / 2) }px)`;
        }

        if(this.center)
        {
            element.style.top = `calc(50vh - ${ (element.offsetHeight / 2) }px)`;
            element.style.left = `calc(50vw - ${ (element.offsetWidth / 2) }px)`;
        }

        const memory = DraggableDirective.POS_MEMORY.get(this._name);

        if(memory)
        {
            this._offset.x  = memory.offset.x;
            this._offset.y  = memory.offset.y;

            this.translate();
        }

        this.setupEvents();
    }

    public ngOnDestroy(): void
    {
        this._destroy.next();

        if(this._handle)
        {
            this._handle.classList.remove('header-draggable');

            this._handle.parentElement.classList.remove('header-draggable');
        }
    }

    private setupEvents(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            const mousedown$  = fromEvent(this._handle, 'mousedown');
            const mousemove$  = fromEvent(document, 'mousemove');
            const mouseup$    = fromEvent(document, 'mouseup');

            const mousedrag$ = mousedown$
                .pipe(
                    switchMap((event: MouseEvent) =>
                    {
                        const startX = event.clientX;
                        const startY = event.clientY;

                        return mousemove$
                            .pipe(
                                map((event: MouseEvent) =>
                                {
                                    event.preventDefault();

                                    this._delta = {
                                        x: event.clientX - startX,
                                        y: event.clientY - startY
                                    };
                                }),
                                takeUntil(mouseup$)
                            );
                    }),
                    takeUntil(this._destroy)
                );

            mousedrag$.subscribe(() =>
            {
                this._isDragging = true;

                if(this._delta.x === 0 && this._delta.y === 0) return;

                this.translate();
            });

            mouseup$
                .pipe(
                    takeUntil(this._destroy)
                );

            mouseup$.subscribe(() =>
            {
                if(!this._isDragging) return;

                this._isDragging = false;

                this._offset.x  += this._delta.x;
                this._offset.y  += this._delta.y;
                this._delta      = { x: 0, y: 0 };

                const left = this._target.offsetLeft + this._offset.x;
                const top = this._target.offsetTop + this._offset.y;

                if(top < DraggableDirective.BOUNDS_THRESHOLD_TOP)
                {
                    this._offset.y = -this._target.offsetTop;
                }

                else if((top + this._handle.offsetHeight) >= (document.body.offsetHeight - DraggableDirective.BOUNDS_THRESHOLD_TOP))
                {
                    this._offset.y = (document.body.offsetHeight - this._target.offsetHeight) - this._target.offsetTop;
                }

                if((left + this._target.offsetWidth) < DraggableDirective.BOUNDS_THRESHOLD_LEFT)
                {
                    this._offset.x = -this._target.offsetLeft;
                }

                else if(left >= (document.body.offsetWidth - DraggableDirective.BOUNDS_THRESHOLD_LEFT))
                {
                    this._offset.x = (document.body.offsetWidth - this._target.offsetWidth) - this._target.offsetLeft;
                }

                this.translate();

                if(!this.noMemory)
                {
                    DraggableDirective.POS_MEMORY.set(this._name, {
                        offset: {
                            x: this._offset.x + 0,
                            y: this._offset.y + 0
                        }
                    });
                }
            });
        });
    }

    private translate(): void
    {
        this._target.style.transform = `translate(${this._offset.x + this._delta.x}px, ${this._offset.y + this._delta.y}px)`;
    }
}
