import { NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum, StringDataType } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { FriendFurniEngravingWidget } from '../furniture/friendfurni/friendfurni.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FriendFurniEngravingWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetManager = null;
    private _widget: FriendFurniEngravingWidget = null;

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FRIEND_FURNI_ENGRAVING;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;
    }

    public set widget(widget: FriendFurniEngravingWidget)
    {
        this._widget = widget;
    }

    public dispose(): void
    {
        this._container = null;
        this._widget = null;
        this._isDisposed = true;
    }

    public processEvent(event: NitroEvent): void
    {
        if(this.disposed || event == null) return;

        let widgetEvent: RoomEngineTriggerWidgetEvent = null;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);
                if(widgetEvent && this._container.roomEngine && this._widget)
                {
                    const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                    if(roomObject)
                    {
                        const model = roomObject.model; // local_4
                        if(model)
                        {
                            const local5 = new StringDataType();
                            local5.initializeFromRoomObjectModel(model);
                            this._widget.open(roomObject.id, <number>model.getValue(RoomObjectVariable.FURNITURE_FRIENDFURNI_ENGRAVING), local5);
                        }
                    }
                }
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING ];
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public update():void
    {
    }
}
