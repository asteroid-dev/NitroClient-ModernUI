import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetConversionPointMessage extends RoomWidgetMessage
{
    public static RWCPM_CONVERSION_POINT: string = 'RWCPM_CONVERSION_POINT';

    private _category: string;
    private _pointType: string;
    private _action: string;
    private _extraString: string;
    private _extraInt: number;

    constructor(k: string, _arg_2: string, _arg_3: string, _arg_4: string, _arg_5: string='', _arg_6: number=0)
    {
        super(k);
        this._category = _arg_2;
        this._pointType = _arg_3;
        this._action = _arg_4;
        this._extraString = ((_arg_5) ? _arg_5 : '');
        this._extraInt = ((_arg_6) ? _arg_6 : 0);
    }

    public get category(): string
    {
        return this._category;
    }

    public get _Str_23854(): string
    {
        return this._pointType;
    }

    public get action(): string
    {
        return this._action;
    }

    public get _Str_22656(): string
    {
        return this._extraString;
    }

    public get _Str_24399(): number
    {
        return this._extraInt;
    }
}
