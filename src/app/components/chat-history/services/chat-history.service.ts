import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AdvancedMap, IMessageEvent, Nitro, RoomInfoEvent } from '@nitrots/nitro-renderer';
import { ChatHistoryItem } from '../common/ChatHistoryItem';

@Injectable()
export class ChatHistoryService implements OnDestroy
{
    public static MESSAGE_RECEIVED: string = 'CHS_MESSAGE_RECEIVED';

    private _messages: IMessageEvent[];

    private _lastRoomId: number = -1;
    private _maxHistoryItems: number = 100;
    private _historyItems: ChatHistoryItem[] = [];
    private _queuedItems: AdvancedMap<number, ChatHistoryItem[]>;

    constructor(private _ngZone: NgZone)
    {
        this._maxHistoryItems   = Nitro.instance.getConfiguration('chat.history.max.items', 100);
        this._queuedItems = new AdvancedMap();

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            this._messages = [
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const data = parser.data;

        if(this._lastRoomId === data.roomId) return;

        this._ngZone.run(() =>
        {
            this._lastRoomId = data.roomId;

            const entryItem = new ChatHistoryItem();

            entryItem.content = (parser.data.roomName + '');

            this.addItem(this._lastRoomId, entryItem);

            this.processQueue(this._lastRoomId);
        });
    }

    public addItem(roomId: number, item: ChatHistoryItem): void
    {
        if(!item) return;

        this._ngZone.run(() =>
        {
            if(roomId !== this._lastRoomId)
            {
                const queue = this.getQueuedSet(roomId);

                if(queue) queue.push(item);

                return;
            }

            if(this._historyItems.length >= this._maxHistoryItems) this._historyItems.shift();

            this._historyItems.push(item);
        });
    }

    public getQueuedSet(roomId: number): ChatHistoryItem[]
    {
        let existing = this._queuedItems.getValue(roomId);

        if(!existing)
        {
            existing = [];

            this._queuedItems.add(roomId, existing);
        }

        return existing;
    }

    public processQueue(roomId: number): void
    {
        const existing = this._queuedItems.getValue(roomId);

        if(!existing) return;

        for(const item of existing) (item && this.addItem(roomId, item));

        this._queuedItems.remove(roomId);
    }

    public get historyItems(): ChatHistoryItem[]
    {
        return this._historyItems;
    }
}
