import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ApplyTonerComposer, ColorConverter, FurnitureMultiStateComposer } from '@nitrots/nitro-renderer';
import { ColorEvent } from 'ngx-color';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { FurnitureBackgroundColorWidgetHandler } from '../../handlers/FurnitureBackgroundColorWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-backgroundcolor-component',
    templateUrl: './backgroundcolor.template.html'
})
export class BackgroundColorFurniWidget extends ConversionTrackingWidget
{
    private _furniId: number    = -1;
    private _visible: boolean   = false;

    public saturation: number = 0;
    public hue: number        = 0;
    public lightness: number  = 0;
    public hsl?: { h?: number, s?: number, l?: number } = { h: 0, s: 0, l: 0 };

    constructor(private _ngZone: NgZone)
    {
        super();
    }

    public open(objectId: number, hue: number, sat: number, light: number): void
    {
        this._ngZone.run(() =>
        {
            this._furniId   = objectId;
            this._visible   = true;

            this.hue        = Math.max(hue, 0);
            this.saturation = Math.max(sat, 0);
            this.lightness  = Math.max(light, 0);

            this.hsl = { h: ((this.hue / 255) * 360), s: (this.saturation / 255), l: (this.lightness / 255) };
        });
    }

    public hide(): void
    {
        this._visible   = false;
        this._furniId   = -1;
    }

    public handleChangeComplete(event: ColorEvent): void
    {
        if(!event) return;

        const hsl = ColorConverter.rgbToHSL(parseInt(event.color.hex.replace('#', ''), 16));

        this.hue        = (((hsl >> 16) & 0xFF));
        this.saturation = (((hsl >> 8) & 0xFF));
        this.lightness  = ((hsl & 0xFF));
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'apply':
                this.handler.container.connection.send(new ApplyTonerComposer(this._furniId, this.hue, this.saturation, this.lightness));
                break;
            case 'on_off':
                this.handler.container.connection.send(new FurnitureMultiStateComposer(this._furniId));
                break;
        }
    }

    public get handler(): FurnitureBackgroundColorWidgetHandler
    {
        return (this.widgetHandler as FurnitureBackgroundColorWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public get delaySliderOptions(): Options
    {
        return {
            floor:0,
            ceil:255,
            step:1,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
