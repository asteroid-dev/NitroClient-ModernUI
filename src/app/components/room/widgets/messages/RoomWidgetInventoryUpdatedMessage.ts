import { RoomWidgetUpdateEvent } from '../events/RoomWidgetUpdateEvent';

export class RoomWidgetInventoryUpdatedMessage extends RoomWidgetUpdateEvent
{
    public static RWIUM_INVENTORY_UPDATED: string = 'RWIUM_INVENTORY_UPDATED';

    constructor(k: string)
    {
        super(k);
    }
}