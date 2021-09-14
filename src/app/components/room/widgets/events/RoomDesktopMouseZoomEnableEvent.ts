import { NitroEvent } from '../../../../core/events/NitroEvent';

export class RoomDesktopMouseZoomEnableEvent extends NitroEvent
{
    public static RDMZEE_ENABLED: string = 'RDMZEE_ENABLED';

    private _Str_2699: boolean;

    constructor(k: boolean)
    {
        super(RoomDesktopMouseZoomEnableEvent.RDMZEE_ENABLED);

        this._Str_2699 = k;
    }
}