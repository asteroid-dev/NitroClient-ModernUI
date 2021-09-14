import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetUseProductMessage extends RoomWidgetMessage
{
    public static RWUPM_PET_PRODUCT: string = 'RWUPM_PET_PRODUCT';
    public static MONSTERPLANT_SEED: string = 'RWUPM_MONSTERPLANT_SEED';

    private _roomObjectId: number = 0;
    private _petId: number = -1;

    constructor(k: string, _arg_2: number, _arg_3: number=-1)
    {
        super(k);

        this._roomObjectId = _arg_2;
        this._petId = _arg_3;
    }

    public get _Str_2713(): number
    {
        return this._roomObjectId;
    }

    public get _Str_2508(): number
    {
        return this._petId;
    }
}
