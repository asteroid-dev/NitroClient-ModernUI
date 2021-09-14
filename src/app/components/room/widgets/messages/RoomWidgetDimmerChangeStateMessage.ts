import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetDimmerChangeStateMessage extends RoomWidgetMessage
{
    public static RWCDSM_CHANGE_STATE: string = 'RWCDSM_CHANGE_STATE';

    constructor()
    {
        super(RoomWidgetDimmerChangeStateMessage.RWCDSM_CHANGE_STATE);
    }
}
