import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetGetSettingsMessage extends RoomWidgetMessage
{
    public static RWGSM_GET_SETTINGS: string = 'RWGSM_GET_SETTINGS';

    constructor(k: string)
    {
        super(k);
    }
}
