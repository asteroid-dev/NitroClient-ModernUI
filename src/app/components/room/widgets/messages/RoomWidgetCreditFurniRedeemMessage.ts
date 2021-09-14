import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetCreditFurniRedeemMessage extends RoomWidgetMessage
{
    public static RWFCRM_REDEEM: string = 'RWFCRM_REDEEM';

    private _objectId: number;

    constructor(k: string, _arg_2: number)
    {
        super(k);
        this._objectId = _arg_2;
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}
