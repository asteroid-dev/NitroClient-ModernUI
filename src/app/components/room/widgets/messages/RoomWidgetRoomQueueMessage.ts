import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetRoomQueueMessage extends RoomWidgetMessage
{
    public static RWRQM_EXIT_QUEUE: string = 'RWRQM_EXIT_QUEUE';
    public static RWRQM_CHANGE_TO_VISITOR_QUEUE: string = 'RWRQM_CHANGE_TO_VISITOR_QUEUE';
    public static RWRQM_CHANGE_TO_SPECTATOR_QUEUE: string = 'RWRQM_CHANGE_TO_SPECTATOR_QUEUE';
    public static RWRQM_CLUB_LINK: string = 'RWRQM_CLUB_LINK';

    constructor(k: string)
    {
        super(k);
    }
}
