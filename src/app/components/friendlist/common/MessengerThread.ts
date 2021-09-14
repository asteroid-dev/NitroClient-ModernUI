import { EventEmitter } from '@angular/core';
import { MessengerChat } from './MessengerChat';
import { MessengerFriend } from './MessengerFriend';

export class MessengerThread
{
    public static MESSAGE_RECEIVED: string = 'MT_MESSAGE_RECEIVED';

    private _participant: MessengerFriend;
    private _chats: MessengerChat[];
    private _lastUpdated: Date;
    private _unread: boolean;

    private _emitter: EventEmitter<string>;

    constructor(participant: MessengerFriend)
    {
        this._participant   = participant;
        this._chats         = [];
        this._lastUpdated   = new Date();
        this._unread        = false;

        this._emitter       = new EventEmitter();
    }

    public insertChat(senderId: number, message: string, secondsSinceSent: number = 0, extraData: string = null, type: number = 0): MessengerChat
    {
        const chat = new MessengerChat(senderId, message, secondsSinceSent, extraData, type);

        this._chats.push(chat);

        this._lastUpdated   = new Date();
        this._unread        = true;

        this._emitter.emit(MessengerThread.MESSAGE_RECEIVED);

        return chat;
    }

    public setRead(): void
    {
        this._unread = false;
    }

    public get participant(): MessengerFriend
    {
        return this._participant;
    }

    public get chats(): MessengerChat[]
    {
        return this._chats;
    }

    public get lastUpdated(): Date
    {
        return this._lastUpdated;
    }

    public get unread(): boolean
    {
        return this._unread;
    }

    public get emitter(): EventEmitter<string>
    {
        return this._emitter;
    }
}