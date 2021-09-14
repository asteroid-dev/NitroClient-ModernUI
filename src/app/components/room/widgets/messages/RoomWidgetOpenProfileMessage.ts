import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetOpenProfileMessage extends RoomWidgetMessage
{
    public static RWOPEM_OPEN_USER_PROFILE: string = 'RWOPEM_OPEN_USER_PROFILE';

    private _userId: number;
    private _trackingLocation: string;

    constructor(k: string, _arg_2: number, _arg_3: string)
    {
        super(k);

        this._userId = _arg_2;
        this._trackingLocation = _arg_3;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get _Str_22577(): string
    {
        return this._trackingLocation;
    }
}
