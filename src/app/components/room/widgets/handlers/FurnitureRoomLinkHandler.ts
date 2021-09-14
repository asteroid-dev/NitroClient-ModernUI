import { IMessageEvent, Nitro, NitroEvent, RoomEngineTriggerWidgetEvent, RoomInfoComposer, RoomInfoEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { NotificationBroadcastMessageComponent } from '../../../notification/components/broadcast-message/broadcast-message.component';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureRoomLinkHandler implements IRoomWidgetHandler
{
    private static INTERNALLINK: string = 'internalLink';

    private _container: IRoomWidgetManager                 = null;
    private _messages: IMessageEvent[]                              = [];
    private _link: string                                           = null;
    private _roomIdToEnter: number                                  = 0;
    private _confirmDialog: NotificationBroadcastMessageComponent   = null;

    public dispose(): void
    {
        this.container      = null;
        this._link          = null;
        this._roomIdToEnter = 0;

        this.closeConfirmDialog();
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
            case RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK:
                widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent && this._container.roomEngine)
                {
                    const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                    if(roomObject && roomObject.model)
                    {
                        let link = roomObject.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA)[FurnitureRoomLinkHandler.INTERNALLINK];

                        if(!link || (link === '') || (link.length === 0))
                        {
                            link = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);
                        }

                        if(!link || (link.length === 0)) return;

                        this.closeConfirmDialog();

                        this._link          = link;
                        this._roomIdToEnter = parseInt(link, 10);

                        if(this._container && this._container.connection)
                        {
                            this._container.connection.send(new RoomInfoComposer(this._roomIdToEnter, false, false));
                        }
                    }
                }

                return;
        }
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const roomData = parser.data;

        if(!roomData) return;

        if(roomData.roomId !== this._roomIdToEnter) return;

        this._roomIdToEnter = 0;

        const roomName    = roomData.roomName;
        const ownerName   = roomData.ownerName;
        let message     = Nitro.instance.getLocalization('room.link.confirmation.message');

        if(message && (message.indexOf('%%room_name%%') > -1))
        {
            message = message.replace('%%room_name%%', roomName);
        }

        if(message && (message.indexOf('%%owner_name%%') > -1))
        {
            message = message.replace('%%owner_name%%', ownerName);
        }

        this.closeConfirmDialog();

        if(this._container && this._container.notificationService)
        {
            this._confirmDialog = this._container.notificationService.alertWithConfirm(message, null, () =>
            {
                Nitro.instance.createLinkEvent('navigator/goto/' + this._link);
            });
        }
    }

    private closeConfirmDialog(): void
    {
        if(!this._confirmDialog) return;

        this._confirmDialog.close();

        this._confirmDialog = null;
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
        return RoomWidgetEnum.ROOM_LINK;
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
            this._messages = [ new RoomInfoEvent(this.onRoomInfoEvent.bind(this)) ];

            for(const message of this._messages) container.connection.addMessageEvent(message);
        }
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK ];
    }
}
