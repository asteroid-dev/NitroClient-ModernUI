import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetChangeEmailMessage extends RoomWidgetMessage
{
    public static RWCEM_CHANGE_EMAIL: string = 'rwcem_change_email';

    private _Str_6877: string;

    constructor(k: string)
    {
        super(RoomWidgetChangeEmailMessage.RWCEM_CHANGE_EMAIL);

        this._Str_6877 = k;
    }

    public get _Str_22654(): string
    {
        return this._Str_6877;
    }
}
