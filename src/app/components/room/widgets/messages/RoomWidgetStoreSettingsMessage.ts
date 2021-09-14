import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetStoreSettingsMessage extends RoomWidgetMessage
{
    public static RWSSM_STORE_SETTINGS: string = 'RWSSM_STORE_SETTINGS';
    public static RWSSM_STORE_SOUND: string = 'RWSSM_STORE_SOUND';
    public static RWSSM_PREVIEW_SOUND: string = 'RWSSM_PREVIEW_SOUND';
    public static RWSSM_STORE_CHAT: string = 'RWSSM_STORE_CHAT';

    private _traxVolume: number;
    private _furniVolume: number;
    private _genericVolume: number;
    private _forceOldChat: boolean;

    constructor(k: string)
    {
        super(k);
    }

    public get _Str_3410(): number
    {
        return this._traxVolume;
    }

    public set _Str_3410(k: number)
    {
        this._traxVolume = k;
    }

    public get _Str_3488(): number
    {
        return this._furniVolume;
    }

    public set _Str_3488(k: number)
    {
        this._furniVolume = k;
    }

    public get _Str_3960(): number
    {
        return this._genericVolume;
    }

    public set _Str_3960(k: number)
    {
        this._genericVolume = k;
    }

    public get _Str_12967(): boolean
    {
        return this._forceOldChat;
    }

    public set _Str_12967(k: boolean)
    {
        this._forceOldChat = k;
    }
}
