import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ColorConverter, IRoomRenderingCanvas, Nitro, RoomPreviewer, TextureUtils } from '@nitrots/nitro-renderer';

@Component({
    selector: '[nitro-room-preview-component]',
    templateUrl: './room-preview.template.html'
})
export class RoomPreviewComponent implements OnChanges, OnDestroy, AfterViewInit
{
    @ViewChild('previewImage')
    public previewImage: ElementRef<HTMLDivElement>;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    @Input()
    public width: number = 1;

    @Input()
    public height: number = 1;

    @Input()
    public model: string = null;

    @Input()
    public wallHeight: number = -1;

    @Input()
    public modelScale: boolean = true;

    public renderingCanvas: IRoomRenderingCanvas = null;
    public imageUrl: string = null;
    public isRunning: boolean = false;

    constructor(
        private _elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone)
    {
        this.onClick = this.onClick.bind(this);
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        if(changes.model)
        {
            const prevModel = changes.model.previousValue;
            const nextModel = changes.model.currentValue;

            if(nextModel && (nextModel !== prevModel)) this.updateModel();
        }

        if(changes.wallHeight)
        {
            const prevWallHeight = changes.wallHeight.previousValue;
            const nextWallHeight = changes.wallHeight.currentValue;

            if(nextWallHeight && (nextWallHeight !== prevWallHeight)) this.updateModel();
        }
    }

    public ngOnDestroy(): void
    {
        this.stop();
    }

    public ngAfterViewInit(): void
    {
        if(!this.roomPreviewer) return;

        if(this.width === 1) this.width 	= (Math.trunc(this.previewImageElement.offsetWidth));
        if(this.height === 1) this.height	= (Math.trunc(this.previewImageElement.offsetHeight));

        this.previewImageElement.style.minWidth     = (this.width + 'px');
        this.previewImageElement.style.minHeight    = (this.height + 'px');

        if(this.roomPreviewer)
        {
            let backgroundColor = document.defaultView.getComputedStyle(this.previewImageElement, null)['backgroundColor'];

            backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
            backgroundColor = backgroundColor.replace('#', '0x');

            this.roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

            if(this.model) this.updateModel();

            this.roomPreviewer.getRoomCanvas(this.width, this.height);

            this.renderingCanvas	= this.roomPreviewer.getRenderingCanvas();
        }

        this.start();
    }

    public start(): void
    {
        if(this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.addEventListener('click', this.onClick);

            Nitro.instance.ticker.add(this.update, this);
        });

        this.isRunning = true;
    }

    public stop(): void
    {
        if(!this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.removeEventListener('click', this.onClick);

            Nitro.instance.ticker.remove(this.update, this);
        });

        this.isRunning = false;
    }

    public update(time: number): void
    {
        if(this.roomPreviewer && this.renderingCanvas)
        {
            this.roomPreviewer.updatePreviewRoomView();

            if(this.renderingCanvas.canvasUpdated)
            {
                const imageUrl = TextureUtils.generateImageUrl(this.renderingCanvas.master);

                this.previewImageElement.style.backgroundImage = `url(${ imageUrl })`;
            }
        }
    }

    public onClick(event: MouseEvent): void
    {
        if(!event || !this.isRunning || !this.roomPreviewer) return;

        if(event.shiftKey)
        {
            this.roomPreviewer.changeRoomObjectDirection();
        }
        else
        {
            this.roomPreviewer.changeRoomObjectState();
        }
    }

    private updateModel(): void
    {
        if(!this.roomPreviewer) return;

        this.roomPreviewer.updatePreviewModel(this.model, this.wallHeight, this.modelScale);
    }

    public get previewImageElement(): HTMLDivElement
    {
        return ((this.previewImage && this.previewImage.nativeElement) || null);
    }
}
