import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetStickieSendUpdateMessage extends RoomWidgetMessage
{
    public static SEND_UPDATE: string   = 'RWSUM_STICKIE_SEND_UPDATE';
    public static SEND_DELETE: string   = 'RWSUM_STICKIE_SEND_DELETE';

    private _objectId: number;
    private _text: string;
    private _colorHex: string;

    constructor(type: string, objectId: number, text: string = '', colorHex: string = '')
    {
        super(type);

        this._objectId  = objectId;
        this._text      = text;
        this._colorHex  = colorHex;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get text(): string
    {
        return this._text;
    }

    public get colorHex(): string
    {
        return this._colorHex;
    }
}
