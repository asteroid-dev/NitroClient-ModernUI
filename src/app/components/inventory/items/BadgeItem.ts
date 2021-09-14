export class BadgeItem
{
    private readonly _badgeCode: string;

    private _isInUse: boolean;
    private _isUnseen: boolean;

    constructor(badgeId: string, isUnseen: boolean)
    {
        this._badgeCode = badgeId;
        this._isInUse   = false;
        this._isUnseen  = isUnseen;
    }

    public get badgeCode(): string
    {
        return this._badgeCode;
    }

    public get isInUse(): boolean
    {
        return this._isInUse;
    }

    public set isInUse(k: boolean)
    {
        this._isInUse = k;
    }

    public get isUnseen(): boolean
    {
        return this._isUnseen;
    }

    public set isUnseen(flag: boolean)
    {
        this._isUnseen = flag;
    }
}
