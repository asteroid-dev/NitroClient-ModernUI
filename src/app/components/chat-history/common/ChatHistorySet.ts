import { ChatHistoryItem } from './ChatHistoryItem';

export class ChatHistorySet
{
    public static SET_COUNTER: number=  0;

    private _id: number;
    private _roomId: number;
    private _items: ChatHistoryItem[];

    constructor(roomId: number)
    {
        this._id        = ++ChatHistorySet.SET_COUNTER;
        this._roomId    = roomId;
        this._items     = [];
    }

    public addItem(item: ChatHistoryItem): void
    {
        if(!item) return;

        this._items.push(item);
    }

    public get id(): number
    {
        return this._id;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get items(): ChatHistoryItem[]
    {
        return this._items;
    }
}