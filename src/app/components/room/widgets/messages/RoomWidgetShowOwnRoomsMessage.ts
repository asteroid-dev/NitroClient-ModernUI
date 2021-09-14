import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetShowOwnRoomsMessage extends RoomWidgetMessage
{
    public static RWSORM_SHOW_OWN_ROOMS: string = 'RWSORM_SHOW_OWN_ROOMS';

    constructor()
    {
        super(RoomWidgetShowOwnRoomsMessage.RWSORM_SHOW_OWN_ROOMS);
    }
}
