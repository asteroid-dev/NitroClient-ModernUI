import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetSpamWallPostItFinishEditingMessage extends RoomWidgetMessage
{
    public static RWSWPFEE_SEND_POSTIT_DATA: string = 'RWSWPFEE_SEND_POSTIT_DATA';

    private _objectId: number;
    private _location: string;
    private _text: string;
    private _colorHex: string;

    constructor(k: string, _arg_2: number, _arg_3: string, _arg_4: string, _arg_5: string)
    {
        super(k);

        this._objectId = _arg_2;
        this._location = _arg_3;
        this._text = _arg_4;
        this._colorHex = _arg_5;
    }

    public get location(): string
    {
        return this._location;
    }

    public get _Str_1577(): number
    {
        return this._objectId;
    }

    public get text(): string
    {
        return this._text;
    }

    public get _Str_10471(): string
    {
        return this._colorHex;
    }
}
