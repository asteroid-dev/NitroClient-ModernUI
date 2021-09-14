import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetStickieDataUpdateEvent } from '../../events/RoomWidgetStickieDataUpdateEvent';
import { FurnitureStickieHandler } from '../../handlers/FurnitureStickieHandler';
import { RoomWidgetStickieSendUpdateMessage } from '../../messages/RoomWidgetStickieSendUpdateMessage';

@Component({
    selector: 'nitro-room-furniture-sticky',
    templateUrl: './stickie.template.html'
})
export class StickieFurniComponent extends ConversionTrackingWidget
{
    public AVAILABLE_COLORS: string[] = ['9CCEFF','FF9CFF', '9CFF9C','FFFF33'];

    private _objectId: number       = -1;
    private _colorHex: string       = null;
    private _text: string           = null;
    private _isController: boolean  = false;
    private _visible: boolean       = false;

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onRoomWidgetStickieDataUpdateEvent = this.onRoomWidgetStickieDataUpdateEvent.bind(this);
    }

    public dispose(): void
    {
        this.updateStickie();

        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.onRoomWidgetStickieDataUpdateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, this.onRoomWidgetStickieDataUpdateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomWidgetStickieDataUpdateEvent(event: RoomWidgetStickieDataUpdateEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._objectId      = event._Str_1577;
            this._colorHex      = event._Str_10471;
            this._text          = event.text;
            this._isController  = event.controller;
            this._visible       = true;
        });
    }

    public processAction(action: string): void
    {
        if(!action || (action === '')) return;

        if(this.AVAILABLE_COLORS.indexOf(action) >= 0)
        {
            this._colorHex = action;

            this.updateStickie();

            return;
        }

        switch(action)
        {
            case 'delete':
                this.deleteStickie();
                return;
        }
    }

    public hide(): void
    {
        this.updateStickie();

        this._objectId      = -1;
        this._colorHex      = null;
        this._text          = null;
        this._isController  = false;
        this._visible       = false;
    }

    private updateStickie(): void
    {
        if(this._objectId === -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_UPDATE, this._objectId, this._text, this._colorHex));
    }

    private deleteStickie(): void
    {
        if(this._objectId === -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetStickieSendUpdateMessage(RoomWidgetStickieSendUpdateMessage.SEND_DELETE, this._objectId));

        this.hide();
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get handler(): FurnitureStickieHandler
    {
        return (this.widgetHandler as FurnitureStickieHandler);
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get colorHex(): string
    {
        return this._colorHex;
    }

    public get text(): string
    {
        return this._text;
    }

    public set text(text: string)
    {
        this._text = text;
    }

    public get isController(): boolean
    {
        return this._isController;
    }
}
