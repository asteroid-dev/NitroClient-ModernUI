import { NitroEvent, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetStickieDataUpdateEvent } from '../events/RoomWidgetStickieDataUpdateEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetStickieSendUpdateMessage } from '../messages/RoomWidgetStickieSendUpdateMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureStickieHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;
    private _isDisposed: boolean                    = false;

    public dispose(): void
    {
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE: {
                const widgetMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(roomObject)
                {
                    const data = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_ITEMDATA);

                    if(data.length < 6) return null;

                    let color: string   = null;
                    let text: string    = null;

                    if(data.indexOf(' ' ) > 0)
                    {
                        color   = data.slice(0, data.indexOf(' '));
                        text    = data.slice((data.indexOf(' ') + 1), data.length);
                    }
                    else
                    {
                        color = data;
                    }

                    const canModify = (this._container.roomSession.isRoomOwner || this._container.sessionDataManager.isModerator);

                    this._container.events.dispatchEvent(new RoomWidgetStickieDataUpdateEvent(RoomWidgetStickieDataUpdateEvent.RWSDUE_STICKIE_DATA, widgetMessage.objectId, roomObject.type, text, color, canModify));
                }

                break;
            }
            case RoomWidgetStickieSendUpdateMessage.SEND_UPDATE: {
                const stickieUpdateMessage = (message as RoomWidgetStickieSendUpdateMessage);

                this._container.roomEngine.modifyRoomObjectData(stickieUpdateMessage.objectId, RoomObjectCategory.WALL, stickieUpdateMessage.colorHex, stickieUpdateMessage.text);

                break;
            }
            case RoomWidgetStickieSendUpdateMessage.SEND_DELETE: {
                const stickieUpdateMessage = (message as RoomWidgetStickieSendUpdateMessage);

                this._container.roomEngine.deleteRoomObject(stickieUpdateMessage.objectId, RoomObjectCategory.WALL);

                break;
            }
        }

        return null;
    }


    public processEvent(event: NitroEvent): void
    {
        return;
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_STICKIE_WIDGET;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE,
            RoomWidgetStickieSendUpdateMessage.SEND_DELETE,
            RoomWidgetStickieSendUpdateMessage.SEND_UPDATE
        ];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
