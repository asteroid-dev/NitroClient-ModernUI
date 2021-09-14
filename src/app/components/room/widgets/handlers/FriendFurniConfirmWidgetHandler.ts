import { IMessageEvent, LoveLockFurniFinishedEvent, LoveLockFurniFriendConfirmedEvent, LoveLockFurniStartEvent, LoveLockStartConfirmComposer, NitroEvent } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { FriendsFurniConfirmWidget } from '../furniture/friendfurni/confirm.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';


export class FriendFurniConfirmWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;
    private _disposed: boolean = false;
    private _messages: IMessageEvent[];
    private _widget: FriendsFurniConfirmWidget;
    private _roomId  =0;
    // private _widget:FriendFurniConfirmWidget;

    constructor()
    {
        this._roomId = Math.floor(Math.random() * 11);
        this.onLoveLockFurniFinishedEvent = this.onLoveLockFurniFinishedEvent.bind(this);
        this.onLoveLockFurniFriendConfirmedEvent = this.onLoveLockFurniFriendConfirmedEvent.bind(this);
        this.onLoveLockFurniStartEvent = this.onLoveLockFurniStartEvent.bind(this);
    }

    public dispose(): void
    {
        for(const message of this._messages) this._container.connection.removeMessageEvent(message);
        this._messages = [];
        this._container = null;
        this._disposed = true;
    }

    public processEvent(event: NitroEvent): void
    {
        return;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public _Str_17138(furniId: number, confirmed: boolean): void
    {
        if(this._container == null || this._disposed)
        {
            return;
        }
        this._container.connection.send(new LoveLockStartConfirmComposer(furniId, confirmed));
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get type(): string
    {
        return '';
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
            this._messages = [
                new LoveLockFurniStartEvent(this.onLoveLockFurniStartEvent),
                new LoveLockFurniFriendConfirmedEvent(this.onLoveLockFurniFriendConfirmedEvent),
                new LoveLockFurniFinishedEvent(this.onLoveLockFurniFinishedEvent)
            ];

            for(const message of this._messages) container.connection.addMessageEvent(message);
        }
    }



    private onLoveLockFurniStartEvent(event: LoveLockFurniStartEvent)
    {
        if(!this._widget || !event || !event.getParser()) return;

        const parser = event.getParser();
        this._widget.open(parser.furniId, parser.start);
    }

    private onLoveLockFurniFinishedEvent(event: LoveLockFurniFinishedEvent)
    {
        if(!this._widget || !event || !event.getParser()) return;

        const parser = event.getParser();

    }

    private onLoveLockFurniFriendConfirmedEvent(event: LoveLockFurniFriendConfirmedEvent)
    {
    }

    public sendStart(furniId: number, start: boolean): void
    {
        this._container.connection.send(new LoveLockStartConfirmComposer(furniId, start));
    }

    public get messageTypes(): string[]
    {
        return [ ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }

    public get widget(): FriendsFurniConfirmWidget
    {
        return this._widget;
    }

    public set widget(widget: FriendsFurniConfirmWidget)
    {
        this._widget = widget;
    }

}
