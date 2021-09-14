import { NitroEvent, NitroPoint, NitroRectangle, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetUserLocationUpdateEvent } from '../events/RoomWidgetUserLocationUpdateEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetGetObjectLocationMessage } from '../messages/RoomWidgetGetObjectLocationMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class ObjectLocationRequestHandler implements IRoomWidgetHandler
{
    private _disposed: boolean = false;
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._disposed = true;
        this._container = null;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get type(): string
    {
        return null;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_GAME_OBJECT_LOCATION ];
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k || !this._container || !(k instanceof RoomWidgetGetObjectLocationMessage)) return null;

        const session = this._container.roomSession;

        switch(k.type)
        {
            case RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION: {
                if(!session || !session.userDataManager) return null;

                const userData = session.userDataManager.getDataByType(k._Str_1577, k._Str_1723);

                let objectBounds: NitroRectangle    = null;
                let objectLocation: NitroPoint      = null;

                if(userData)
                {
                    objectBounds      = this._container.roomEngine.getRoomObjectBoundingRectangle(session.roomId, userData.roomIndex, RoomObjectCategory.UNIT, this._container.getFirstCanvasId());
                    objectLocation    = this._container.roomEngine.getRoomObjectScreenLocation(session.roomId, userData.roomIndex, RoomObjectCategory.UNIT, this._container.getFirstCanvasId());

                    const rectangle = this._container.getRoomViewRect();

                    if(objectBounds && objectLocation && rectangle)
                    {
                        objectBounds.x += rectangle.x;
                        objectBounds.y += rectangle.y;

                        objectLocation.x += rectangle.x;
                        objectLocation.y += rectangle.y;
                    }
                }

                return new RoomWidgetUserLocationUpdateEvent(k._Str_1577, objectBounds, objectLocation);
            }
        }

        return null;
    }

    public get eventTypes(): string[]
    {
        return [];
    }

    public processEvent(k: NitroEvent): void
    {
    }

    public update(): void
    {
    }
}
