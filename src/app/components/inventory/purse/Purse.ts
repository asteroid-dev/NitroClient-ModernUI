import { Nitro } from '@nitrots/nitro-renderer';

export class Purse
{
    private _isExpiring: boolean = false;
    private _isCitizenshipVipExpiring: boolean = false;
    private _clubDays: number = 0;
    private _clubPeriods: number = 0;
    private _clubPastPeriods: number = 0;
    private _clubHasEverBeenMember: boolean = false;
    private _isVIP: boolean = false;
    private _minutesUntilExpiration: number = 0;
    private _minutesSinceLastModified: number = -1;
    private _lastUpdated: number;

    public get clubDays(): number
    {
        return this._clubDays;
    }

    public set clubDays(k: number)
    {
        this._lastUpdated = Nitro.instance.time;
        this._clubDays = Math.max(0, k);
    }

    public get clubPeriods(): number
    {
        return this._clubPeriods;
    }

    public set clubPeriods(k: number)
    {
        this._lastUpdated = Nitro.instance.time;
        this._clubPeriods = Math.max(0, k);
    }

    public get _Str_9487(): number
    {
        return this._clubPastPeriods;
    }

    public set _Str_9487(k: number)
    {
        this._lastUpdated = Nitro.instance.time;
        this._clubPastPeriods = Math.max(0, k);
    }

    public get _Str_11984(): boolean
    {
        return this._clubHasEverBeenMember;
    }

    public set _Str_11984(k: boolean)
    {
        this._lastUpdated = Nitro.instance.time;
        this._clubHasEverBeenMember = k;
    }

    public get _Str_3738(): boolean
    {
        return this._isVIP;
    }

    public set _Str_3738(k: boolean)
    {
        this._lastUpdated = Nitro.instance.time;
        this._isVIP = k;
    }

    public get _Str_4458(): number
    {
        const k: number = ((Nitro.instance.time - this._lastUpdated) / (1000 * 60));
        const _local_2: number = (this._minutesUntilExpiration - k);
        return (_local_2 > 0) ? _local_2 : 0;
    }

    public set _Str_4458(k: number)
    {
        this._lastUpdated = Nitro.instance.time;
        this._minutesUntilExpiration = k;
    }

    public get _Str_6682(): boolean
    {
        return this._isExpiring;
    }

    public set _Str_6682(k: boolean)
    {
        this._isExpiring = k;
    }

    public get _Str_8836(): boolean
    {
        return this._isCitizenshipVipExpiring;
    }

    public set _Str_8836(k: boolean)
    {
        this._isCitizenshipVipExpiring = k;
    }

    public get _Str_6312(): number
    {
        return this._minutesSinceLastModified;
    }

    public set _Str_6312(k: number)
    {
        this._lastUpdated = Nitro.instance.time;
        this._minutesSinceLastModified = k;
    }
}
