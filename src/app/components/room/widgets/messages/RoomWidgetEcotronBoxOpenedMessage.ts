import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetEcotronBoxOpenedMessage extends RoomWidgetMessage
{
    public static RWEBOM_ECOTRONBOX_OPENED: string = 'RWEBOM_ECOTRONBOX_OPENED';

    private _itemType: string;
    private _classId: number;

    constructor(k: string, _arg_2: string, _arg_3: number)
    {
        super(k);

        this._itemType = _arg_2;
        this._classId = _arg_3;
    }

    public get _Str_2887(): string
    {
        return this._itemType;
    }

    public get _Str_2706(): number
    {
        return this._classId;
    }
}
