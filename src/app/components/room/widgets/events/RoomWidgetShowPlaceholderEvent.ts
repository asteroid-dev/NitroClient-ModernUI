import { RoomWidgetUpdateEvent } from '@nitrots/nitro-renderer';

export class RoomWidgetShowPlaceholderEvent extends RoomWidgetUpdateEvent
{
    public static RWSPE_SHOW_PLACEHOLDER: string = 'RWSPE_SHOW_PLACEHOLDER';

    constructor(k: string)
    {
        super(k);
    }
}
