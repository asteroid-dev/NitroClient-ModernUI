import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetPresentOpenMessage extends RoomWidgetMessage
{
    public static RWPOM_OPEN_PRESENT: string = 'RWPOM_OPEN_PRESENT';

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
