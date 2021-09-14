import { Nitro, NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureInternalLinkHandler implements IRoomWidgetHandler
{
    private static INTERNALLINK: string = 'internalLink';

    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._container = null;
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
            case RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine)
                {
                    const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                    if(roomObject && roomObject.model)
                    {
                        let link = roomObject.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA)[FurnitureInternalLinkHandler.INTERNALLINK];

                        if(!link || (link === '') || (link.length === 0))
                        {
                            link = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);
                        }

                        if(!link || (link.length === 0)) return;

                        Nitro.instance.createLinkEvent(link);
                    }
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
        return RoomWidgetEnum.INTERNAL_LINK;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK ];
    }
}
