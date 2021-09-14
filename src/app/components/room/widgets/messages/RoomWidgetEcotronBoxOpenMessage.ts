import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetEcotronBoxOpenMessage extends RoomWidgetMessage
{
    public static RWEBOM_OPEN_ECOTRONBOX: string = 'RWEBOM_OPEN_ECOTRONBOX';

    private _objectId: number;

    constructor(k: string, _arg_2: number)
    {
        super(k);

        this._objectId = _arg_2;
    }

    public get _Str_1577(): number
    {
        return this._objectId;
    }
}
