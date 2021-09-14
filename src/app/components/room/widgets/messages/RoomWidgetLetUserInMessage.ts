import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetLetUserInMessage extends RoomWidgetMessage
{
    public static RWLUIM_LET_USER_IN: string = 'RWLUIM_LET_USER_IN';

    private _userName: string;
    private _canEnter: boolean;

    constructor(k: string, _arg_2: boolean)
    {
        super(RoomWidgetLetUserInMessage.RWLUIM_LET_USER_IN);

        this._userName = k;
        this._canEnter = _arg_2;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get _Str_23117(): boolean
    {
        return this._canEnter;
    }
}
