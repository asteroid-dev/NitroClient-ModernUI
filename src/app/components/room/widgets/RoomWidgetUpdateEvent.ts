import { NitroEvent } from '@nitrots/nitro-renderer';

export class RoomWidgetUpdateEvent extends NitroEvent
{
    constructor(type: string)
    {
        super(type);
    }
}
