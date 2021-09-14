import { FurnitureStackHeightEvent, IMessageEvent, IRoomObject, NitroEvent, RoomControllerLevel, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { CustomStackHeightComponent } from '../furniture/customstackheight/customstackheight.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureCustomStackHeightWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;
    private _widget: CustomStackHeightComponent     = null;
    private _lastFurniId: number                    = -1;
    private _messages: IMessageEvent[]              = [];

    public dispose(): void
    {
        this.container = null;
        this._widget = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        let widgetEvent: RoomEngineTriggerWidgetEvent = null;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine && this._widget)
                {
                    this._lastFurniId = widgetEvent.objectId;

                    const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                    if(roomObject && this.canManipulateRoomObject(roomObject))
                    {
                        this._widget.open(this._lastFurniId, roomObject.getLocation().z);
                    }
                }

                return;
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine && this._widget)
                {
                    if(this._lastFurniId === widgetEvent.objectId) this._widget.hide();
                }

                return;
        }
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return !!this._container;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CUSTOM_STACK_HEIGHT;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        if(container !== this._container)
        {
            if(this._container)
            {
                for(const message of this._messages) this._container.connection.removeMessageEvent(message);

                this._messages = [];
            }
        }

        this._container = container;

        if(this._container)
        {
            this._messages = [ new FurnitureStackHeightEvent(this.onFurnitureStackHeightEvent.bind(this)) ];

            for(const message of this._messages) container.connection.addMessageEvent(message);
        }
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public get widget(): CustomStackHeightComponent
    {
        return this._widget;
    }

    public set widget(widget: CustomStackHeightComponent)
    {
        this._widget = widget;
    }

    private onFurnitureStackHeightEvent(event: FurnitureStackHeightEvent):void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._widget && this.canManipulateRoomObject()) this._widget.update(parser.furniId, parser.height);
    }

    private canManipulateRoomObject(roomObject: IRoomObject = null): boolean
    {
        const isRoomOwner           = this._container.roomSession.isRoomOwner;
        const hasControllerLevel    = (this._container.roomSession.controllerLevel >= RoomControllerLevel.GUEST);
        const isModerator           = this._container.sessionDataManager.isModerator;
        const isOwner               = (roomObject && this._container.isOwnerOfFurniture(roomObject));

        return (((isRoomOwner) || (isModerator)) || (hasControllerLevel)) || (isOwner);
    }
}
