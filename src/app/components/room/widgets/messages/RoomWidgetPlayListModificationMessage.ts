import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetPlayListModificationMessage extends RoomWidgetMessage
{
    public static RWPLAM_ADD_TO_PLAYLIST: string = 'RWPLAM_ADD_TO_PLAYLIST';
    public static RWPLAM_REMOVE_FROM_PLAYLIST: string = 'RWPLAM_REMOVE_FROM_PLAYLIST';

    private _diskId: number;
    private _slotNumber: number;

    constructor(k: string, _arg_2: number=-1, _arg_3: number=-1)
    {
        super(k);

        this._slotNumber = _arg_2;
        this._diskId = _arg_3;
    }

    public get _Str_5848(): number
    {
        return this._diskId;
    }

    public get _Str_20440(): number
    {
        return this._slotNumber;
    }
}
