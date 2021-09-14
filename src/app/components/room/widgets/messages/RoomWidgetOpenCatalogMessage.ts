import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetOpenCatalogMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_OPEN_CATALOG: string = 'RWGOI_MESSAGE_OPEN_CATALOG';
    public static RWOCM_CLUB_MAIN: string = 'RWOCM_CLUB_MAIN';
    public static RWOCM_PIXELS: string = 'RWOCM_PIXELS';
    public static RWOCM_CREDITS: string = 'RWOCM_CREDITS';
    public static RWOCM_SHELLS: string = 'RWOCM_SHELLS';

    private _pageKey: string;

    constructor(k: string)
    {
        super(RoomWidgetOpenCatalogMessage.RWGOI_MESSAGE_OPEN_CATALOG);

        this._pageKey = k;
    }

    public get _Str_23670(): string
    {
        return this._pageKey;
    }
}
