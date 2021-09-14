import { NitroPoint, NitroRectangle } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class RoomWidgetUserLocationUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWULUE_USER_LOCATION_UPDATE: string = 'RWULUE_USER_LOCATION_UPDATE';

    private _userId: number;
    private _rectangle: NitroRectangle;
    private _Str_20775: NitroPoint;

    constructor(k: number, _arg_2: NitroRectangle, _arg_3: NitroPoint)
    {
        super(RoomWidgetUserLocationUpdateEvent.RWULUE_USER_LOCATION_UPDATE);

        this._userId = k;
        this._rectangle = _arg_2;
        this._Str_20775 = _arg_3;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get rectangle(): NitroRectangle
    {
        return this._rectangle;
    }

    public get _Str_9337(): NitroPoint
    {
        return this._Str_20775;
    }
}
