import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetGetEffectsMessage extends RoomWidgetMessage
{
    public static RWCM_MESSAGE_GET_EFFECTS: string = 'RWCM_MESSAGE_GET_EFFECTS';

    constructor()
    {
        super(RoomWidgetGetEffectsMessage.RWCM_MESSAGE_GET_EFFECTS);
    }
}
