import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetNavigateToRoomMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_NAVIGATE_TO_ROOM: string = 'RWGOI_MESSAGE_NAVIGATE_TO_ROOM';
    public static RWGOI_MESSAGE_NAVIGATE_HOME: string = 'RWGOI_MESSAGE_NAVIGATE_HOME';

    private _roomId: number;

    constructor(k: string, _arg_2: number=-1)
    {
        super(k);

        this._roomId = _arg_2;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
