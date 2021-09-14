import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetZoomToggleMessage extends RoomWidgetMessage
{
    public static RWZTM_ZOOM_TOGGLE: string = 'RWZTM_ZOOM_TOGGLE';

    constructor()
    {
        super(RoomWidgetZoomToggleMessage.RWZTM_ZOOM_TOGGLE);
    }
}
