import { IMessageEvent, INitroCommunicationManager, Nitro, NitroEvent, RoomInfoEvent, RoomLikeRoomComposer, RoomWidgetEnum, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetZoomToggleMessage } from '../messages/RoomWidgetZoomToggleMessage';
import { RoomToolsMainComponent } from '../roomtools/main/main.component';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class RoomToolsWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager; // private var _container:IRoomWidgetManager;
    private _communicationManager: INitroCommunicationManager; // private var _communicationManager:IHabboCommunicationManager;
    private _widget: RoomToolsMainComponent; //private var _widget:RoomToolsWidget;
    private _messages: IMessageEvent[]; //private var _communicationManagerMessageEvents:Vector.<IMessageEvent>;
    // Dont need IHabboNavigator;
    private _disposed: boolean; //private var _disposed:Boolean;
    private _zoomed: boolean = false;

    constructor()
    {
        this._communicationManager = Nitro.instance.communication;
        this._container = null;
        this._widget = null;
        this._messages = [];
        this._disposed = false;

        this.onRoomInfoEvent = this.onRoomInfoEvent.bind(this);
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._communicationManager = null;
        this._widget     = null;

        for(const message of this._messages)
        {
            this._container.connection.removeMessageEvent(message);
        }
        this._container  = null;


        this._messages = [];

        this._disposed   = true;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(message instanceof RoomWidgetZoomToggleMessage)
        {
            this._container.roomEngine.events.dispatchEvent(new RoomZoomEvent(this._container.roomEngine.activeRoomId, this._zoomed ? 1 : 0, false));
            this._zoomed = !this._zoomed;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const roomData = parser.data;

        if(!roomData) return;

        if(parser.roomEnter)
        {
            this._widget.updateRoomInfo(roomData);

            const ownerName = (roomData.showOwner ? (Nitro.instance.getLocalization('room.tool.room.owner.prefix') + ' ' + roomData.ownerName) : Nitro.instance.getLocalization('room.tool.public.room'));

            this._widget.updateRoomTools(roomData.roomName, ownerName, roomData.tags);
            this._widget.addVisitedRoom(roomData);
            this._widget.updateRoomCurrentIndex(roomData.roomId);
        }
    }

    public rateRoom(): void
    {
        if(!this._container) return;

        this._container.connection.send(new RoomLikeRoomComposer(1));
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_TOOLS;
    }

    public get widget(): RoomToolsMainComponent
    {
        return this._widget;
    }

    public set widget(widget: RoomToolsMainComponent)
    {
        this._widget = widget;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;

        if(this._container)
        {
            this._messages = [ new RoomInfoEvent(this.onRoomInfoEvent) ];

            for(const message of this._messages)
            {
                container.connection.addMessageEvent(message);
            }
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
}
