import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetFriendRequestMessage extends RoomWidgetMessage
{
    public static RWFRM_ACCEPT: string = 'RWFRM_ACCEPT';
    public static RWFRM_DECLINE: string = 'RWFRM_DECLINE';

    private _requestId: number = 0;

    constructor(k: string, _arg_2: number=0)
    {
        super(k);

        this._requestId = _arg_2;
    }

    public get _Str_2951(): number
    {
        return this._requestId;
    }
}
