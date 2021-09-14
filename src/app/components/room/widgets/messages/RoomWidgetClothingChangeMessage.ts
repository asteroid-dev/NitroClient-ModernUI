import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetClothingChangeMessage extends RoomWidgetMessage
{
    public static RWCCM_REQUEST_EDITOR: string = 'RWCCM_REQUEST_EDITOR';

    private _objectId: number = 0;
    private _objectCategory: number = 0;
    private _roomId: number = 0;
    private _gender: string = '';

    constructor(k: string, _arg_2: string, _arg_3: number, _arg_4: number, _arg_5: number)
    {
        super(k);

        this._gender = _arg_2;
        this._objectId = _arg_3;
        this._objectCategory = _arg_4;
        this._roomId = _arg_5;
    }

    public get _Str_1577(): number
    {
        return this._objectId;
    }

    public get _Str_4093(): number
    {
        return this._objectCategory;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get gender(): string
    {
        return this._gender;
    }
}
