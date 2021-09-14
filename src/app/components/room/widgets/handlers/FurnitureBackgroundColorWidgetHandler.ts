import { NitroEvent, RoomControllerLevel, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { BackgroundColorFurniWidget } from '../furniture/backgroundcolor/backgroundcolor.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureBackgroundColorWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetManager = null;
    private _widget: BackgroundColorFurniWidget     = null;

    public dispose():void
    {
        this._isDisposed    = true;
        this._container     = null;
        this._widget        = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR: {
                if(!this.canOpenBackgroundToner()) return;

                const roomEngineObjectEvent = <RoomEngineObjectEvent>event;

                const roomObject = this._container.roomEngine.getRoomObject(roomEngineObjectEvent.roomId, roomEngineObjectEvent.objectId, roomEngineObjectEvent.category);
                const model = roomObject.model;
                const hue = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE));
                const sat = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION));
                const light = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS));


                this._widget.open(roomObject.id, hue, sat, light);
            }
                break;
        }
    }

    private canOpenBackgroundToner(): boolean
    {
        const isRoomOwner = this._container.roomSession.isRoomOwner;
        const hasLevel = this._container.roomSession.controllerLevel >= RoomControllerLevel.GUEST;
        const isGodMode = this._container.sessionDataManager.isGodMode;

        return isRoomOwner || hasLevel || isGodMode;
    }


    public set widget(widget: BackgroundColorFurniWidget)
    {
        this._widget = widget;
    }

    public get widget(): BackgroundColorFurniWidget
    {
        return this._widget;
    }


    public update():void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_BACKGROUND_COLOR;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR
        ];
    }
}
