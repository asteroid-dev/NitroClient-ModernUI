export class ChatHistoryItem
{
    public static ITEM_COUNTER: number = 0;

    private _id: number                     = ++ChatHistoryItem.ITEM_COUNTER;
    private _senderId: number               = -1;
    private _senderName: string             = '';
    private _senderColor: number            = 0;
    private _senderImageUrl: string         = null;
    private _content: string                = '';
    private _chatType: number               = 0;
    private _chatStyle: number              = 0;
    private _date: Date                     = new Date();

    public get id(): number
    {
        return this._id;
    }

    public get senderId(): number
    {
        return this._senderId;
    }

    public set senderId(id: number)
    {
        this._senderId = id;
    }

    public get senderName(): string
    {
        return this._senderName;
    }

    public set senderName(name: string)
    {
        this._senderName = name;
    }

    public get senderColorString(): string
    {
        return (this._senderColor && ('#' + (this._senderColor.toString(16).padStart(6, '0'))) || null);
    }

    public set senderColor(color: number)
    {
        this._senderColor = color;
    }

    public get senderImageUrl(): string
    {
        return this._senderImageUrl;
    }

    public set senderImageUrl(url: string)
    {
        this._senderImageUrl = url;
    }

    public get content(): string
    {
        return this._content;
    }

    public set content(content: string)
    {
        this._content = content;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public set chatType(type: number)
    {
        this._chatType = type;
    }

    public get chatStyle(): number
    {
        return this._chatStyle;
    }

    public set chatStyle(style: number)
    {
        this._chatStyle = style;
    }

    public get date(): Date
    {
        return this._date;
    }
}