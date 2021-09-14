import { RoomWidgetUpdateEvent } from '@nitrots/nitro-renderer';

export class RoomWidgetAvatarEditorUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUE_HIDE_AVATAR_EDITOR: string = 'RWUE_HIDE_AVATAR_EDITOR';
    public static RWUE_AVATAR_EDITOR_CLOSED: string = 'RWUE_AVATAR_EDITOR_CLOSED';

    constructor(k: string)
    {
        super(k);
    }
}
