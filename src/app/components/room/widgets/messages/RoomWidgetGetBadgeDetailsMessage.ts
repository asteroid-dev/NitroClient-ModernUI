import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetGetBadgeDetailsMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_GET_BADGE_DETAILS: string = 'RWGOI_MESSAGE_GET_BADGE_DETAILS';

    private _own: boolean;
    private _groupId: number = 0;

    constructor(k: boolean, _arg_2: number)
    {
        super(RoomWidgetGetBadgeDetailsMessage.RWGOI_MESSAGE_GET_BADGE_DETAILS);

        this._own = k;
        this._groupId = _arg_2;
    }

    public get own(): boolean
    {
        return this._own;
    }

    public get groupId(): number
    {
        return this._groupId;
    }
}
