import { Component, NgZone } from '@angular/core';
import { FurnitureStackHeightComposer } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { FurnitureCustomStackHeightWidgetHandler } from '../../handlers/FurnitureCustomStackHeightWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-customstackheight-component',
    templateUrl: './customstackheight.template.html'
})
export class CustomStackHeightComponent extends ConversionTrackingWidget
{
    private static MAX_HEIGHT: number       = 40;
    private static MAX_RANGE_HEIGHT: number = 10;
    private static STEP_VALUE: number       = 0.01;

    private _visible: boolean   = false;
    private _furniId: number    = -1;
    private _height: number     = 0;

    private _saveTimeout: ReturnType<typeof setTimeout> = null;

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(furniId: number, height: number): void
    {
        this._ngZone.run(() =>
        {
            this._furniId   = furniId;
            this._height    = height;
            this._visible   = true;

            this.setHeight(height, true);
        });
    }

    public update(furniId: number, height: number): void
    {
        this._ngZone.run(() => ((this._furniId === furniId) && this.setHeight(height, true)));
    }

    public hide(): void
    {
        this._visible   = false;
        this._furniId   = -1;
        this._height    = 0;
    }

    private setHeight(height: number, fromServer: boolean = false): void
    {
        height = Math.abs(height);

        if(!fromServer) ((height > CustomStackHeightComponent.MAX_HEIGHT) && (height = CustomStackHeightComponent.MAX_HEIGHT));

        this._height = parseFloat(height.toFixed(2));

        if(!fromServer) this.scheduleUpdate(this._height * 100);
    }

    private scheduleUpdate(height: number)
    {
        if(this._saveTimeout)
        {
            clearTimeout(this._saveTimeout);

            this._saveTimeout = null;
        }

        this._saveTimeout = setTimeout(() => this.sendUpdate(height), 5);
    }

    private sendUpdate(height: number): void
    {
        this.widgetHandler.container.connection.send(new FurnitureStackHeightComposer(this._furniId, ~~(height)));
    }

    public placeAboveStack(): void
    {
        this.sendUpdate(-100);
    }

    public placeAtFloor(): void
    {
        this.sendUpdate(0);
    }

    public slideToHeight(height: number): void
    {
        this.height = height;
    }

    public get handler(): FurnitureCustomStackHeightWidgetHandler
    {
        return (this.widgetHandler as FurnitureCustomStackHeightWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get height(): number
    {
        return this._height;
    }

    public set height(value: number)
    {
        this.setHeight(value, false);
    }

    public get minHeight(): number
    {
        return 0;
    }

    public get maxHeight(): number
    {
        return CustomStackHeightComponent.MAX_HEIGHT;
    }
}
