import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetRoomTagSearchMessage extends RoomWidgetMessage
{
    public static RWRTSM_ROOM_TAG_SEARCH: string = 'RWRTSM_ROOM_TAG_SEARCH';

    private _tag: string;

    constructor(k: string)
    {
        super(RoomWidgetRoomTagSearchMessage.RWRTSM_ROOM_TAG_SEARCH);

        this._tag = k;
    }

    public get tag(): string
    {
        return this._tag;
    }
}
