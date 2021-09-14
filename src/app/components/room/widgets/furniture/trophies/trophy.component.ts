import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetTrophyUpdateEvent } from '../../events/RoomWidgetTrophyUpdateEvent';
import { FurnitureTrophyWidgetHandler } from '../../handlers/FurnitureTrophyWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-trophy-compontent',
    templateUrl: './trophy.template.html'
})
export class FurnitureWidgetTrophyComponent extends ConversionTrackingWidget
{
    private _visible: boolean   = false;
    private _color: number      = null;
    private _ownerName: string  = null;
    private _date: string       = null;
    private _message: string    = null;
    private _viewType: number   = null;

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onRoomWidgetTrophyUpdateEvent = this.onRoomWidgetTrophyUpdateEvent.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onRoomWidgetTrophyUpdateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onRoomWidgetTrophyUpdateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomWidgetTrophyUpdateEvent(event: RoomWidgetTrophyUpdateEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._visible   = true;
            this._color     = (event.color - 1);
            this._ownerName = event.name;
            this._date      = event.date;
            this._message   = event.message;
            this._viewType  = event.viewType;

            if((this._color < 0) || (this._color > 2)) this._color = 0;
        });
    }

    public hide(): void
    {
        this._visible = false;
    }

    public get handler(): FurnitureTrophyWidgetHandler
    {
        return (this.widgetHandler as FurnitureTrophyWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get color(): number
    {
        return this._color;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public get date(): string
    {
        return this._date;
    }

    public get message(): string
    {
        return this._message;
    }
}
