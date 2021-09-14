import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetGetBadgeImageMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_GET_BADGE_IMAGE: string = 'RWGOI_MESSAGE_GET_BADGE_IMAGE';

    private _badgeId: string = '';

    constructor(k: string)
    {
        super(RoomWidgetGetBadgeImageMessage.RWGOI_MESSAGE_GET_BADGE_IMAGE);

        this._badgeId = k;
    }

    public get badgeId(): string
    {
        return this._badgeId;
    }
}
