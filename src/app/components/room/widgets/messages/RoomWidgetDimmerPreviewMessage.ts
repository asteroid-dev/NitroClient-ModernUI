import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetDimmerPreviewMessage extends RoomWidgetMessage
{
    public static RWDPM_PREVIEW_DIMMER_PRESET: string = 'RWDPM_PREVIEW_DIMMER_PRESET';

    private _color: number;
    private _brightness: number;
    private _bgOnly: boolean;

    constructor(k: number, _arg_2: number, _arg_3: boolean)
    {
        super(RoomWidgetDimmerPreviewMessage.RWDPM_PREVIEW_DIMMER_PRESET);

        this._color = k;
        this._brightness = _arg_2;
        this._bgOnly = _arg_3;
    }

    public get color(): number
    {
        return this._color;
    }

    public get _Str_5123(): number
    {
        return this._brightness;
    }

    public get _Str_11464(): boolean
    {
        return this._bgOnly;
    }
}
