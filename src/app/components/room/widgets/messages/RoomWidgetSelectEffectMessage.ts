import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetSelectEffectMessage extends RoomWidgetMessage
{
    public static RWCM_MESSAGE_SELECT_EFFECT: string = 'RWCM_MESSAGE_SELECT_EFFECT';
    public static RWCM_MESSAGE_UNSELECT_EFFECT: string = 'RWCM_MESSAGE_UNSELECT_EFFECT';
    public static RWCM_MESSAGE_UNSELECT_ALL_EFFECTS: string = 'RWCM_MESSAGE_UNSELECT_ALL_EFFECTS';

    private _effectType: number;

    constructor(k: string, _arg_2: number=-1)
    {
        super(k);

        this._effectType = _arg_2;
    }

    public get effectType(): number
    {
        return this._effectType;
    }
}
