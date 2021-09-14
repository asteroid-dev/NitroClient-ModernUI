import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetDimmerSavePresetMessage extends RoomWidgetMessage
{
    public static RWSDPM_SAVE_PRESET: string = 'RWSDPM_SAVE_PRESET';

    private _presetNumber: number;
    private _effectTypeId: number;
    private _color: number;
    private _brightness: number;
    private _apply: boolean;

    constructor(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: boolean)
    {
        super(RoomWidgetDimmerSavePresetMessage.RWSDPM_SAVE_PRESET);

        this._presetNumber = k;
        this._effectTypeId = _arg_2;
        this._color = _arg_3;
        this._brightness = _arg_4;
        this._apply = _arg_5;
    }

    public get _Str_25037(): number
    {
        return this._presetNumber;
    }

    public get _Str_24446(): number
    {
        return this._effectTypeId;
    }

    public get color(): number
    {
        return this._color;
    }

    public get _Str_5123(): number
    {
        return this._brightness;
    }

    public get apply(): boolean
    {
        return this._apply;
    }
}
