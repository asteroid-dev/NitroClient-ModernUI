import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { HighScoreData, HighScoreDataType, Nitro } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { FurnitureHighScoreWidgetHandler } from '../../handlers/FurnitureHighScoreWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-highscore-component',
    templateUrl: './highscore.template.html'
})
export class HighscoreComponent extends ConversionTrackingWidget
{
    @ViewChild('activeView')
    public view: ElementRef<HTMLDivElement> = null;

    private _visible: boolean               = false;
    private _toggled: boolean               = false;
    private _objectId: number               = -1;
    private _roomId: number                 = -1;
    private _stuffData: HighScoreDataType   = null;

    public topValue: number                 = 0;
    public leftValue: number                = 0;

    public scoreTypes: string[]             = ['perteam', 'mostwins', 'classic'];
    public clearTypes: string[]             = ['alltime', 'daily', 'weekly', 'monthly'];

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(objectId: number, roomId: number, stuffData: HighScoreDataType): void
    {
        this._ngZone.run(() =>
        {
            this._objectId  = objectId;
            this._roomId    = roomId;
            this._stuffData = stuffData;
            this._visible   = true;
        });
    }

    public updatePoint(x: number, y: number): void
    {
        if(!this._visible) return;

        this._ngZone.run(() =>
        {
            const element = ((this.view && this.view.nativeElement) || null);

            if(!element) return;

            this.leftValue = (x - (element.offsetWidth / 2));
            this.topValue = (y - (element.offsetHeight + 60));
        });
    }

    public openProfile(username: string): void
    {
        Nitro.instance.createLinkEvent('profile/name/' + username);
    }

    public toggle(): void

    {
        this._ngZone.run(() =>
        {
            this._toggled = !this._toggled;
        });
    }

    public hide(): void
    {
        this._ngZone.run(() =>
        {
            this._visible   = false;
            this._objectId  = -1;
            this._roomId    = -1;
            this._stuffData = null;
        });
    }

    public get handler(): FurnitureHighScoreWidgetHandler
    {
        return (this.widgetHandler as FurnitureHighScoreWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get toggled(): boolean
    {
        return this._toggled;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get entries(): HighScoreData[]
    {
        if(!this._stuffData) return [];

        return this._stuffData.entries;
    }

    public get clearTypeCode(): string
    {
        if(!this._stuffData) return null;

        return 'high.score.display.cleartype.' + this.clearTypes[this._stuffData.clearType];
    }

    public get scoreTypeCode(): string
    {
        if(!this._stuffData) return null;

        return 'high.score.display.scoretype.' + this.scoreTypes[this._stuffData.scoreType];
    }

    public get title(): string
    {
        if(!this.scoreTypeCode || !this.clearTypeCode) return null;

        const scoreTypeLocalization = Nitro.instance.getLocalization(this.scoreTypeCode);
        const clearTypeLocalization = Nitro.instance.getLocalization(this.clearTypeCode);

        return Nitro.instance.getLocalizationWithParameters('high.score.display.caption', ['scoretype', 'cleartype'], [scoreTypeLocalization, clearTypeLocalization]);
    }
}
