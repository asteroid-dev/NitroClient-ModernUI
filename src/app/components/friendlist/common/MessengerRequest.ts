import { FriendRequestData } from '@nitrots/nitro-renderer';

export class MessengerRequest
{
    private _requestId: number;
    private _requesterName: string;
    private _requesterUserId: number;
    private _figureString: string;

    public populate(data: FriendRequestData): boolean
    {
        if(!data) return false;

        this._requestId         = data.requestId;
        this._requesterName     = data.requesterName;
        this._figureString      = data.figureString;
        this._requesterUserId   = data.requesterUserId;

        return true;
    }

    public get requestId(): number
    {
        return this._requestId;
    }

    public get requesterName(): string
    {
        return this._requesterName;
    }

    public get requesterUserId(): number
    {
        return this._requesterUserId;
    }

    public get figureString(): string
    {
        return this._figureString;
    }
}
