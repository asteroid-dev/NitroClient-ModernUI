import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetPlayListPlayStateMessage extends RoomWidgetMessage
{
    public static RWPLPS_TOGGLE_PLAY_PAUSE: string = 'RWPLPS_TOGGLE_PLAY_PAUSE';

    private _furniId: number;
    private _position: number;

    constructor(k: string, _arg_2: number, _arg_3: number=-1)
    {
        super(k);

        this._furniId = _arg_2;
        this._position = _arg_3;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get position(): number
    {
        return this._position;
    }
}
