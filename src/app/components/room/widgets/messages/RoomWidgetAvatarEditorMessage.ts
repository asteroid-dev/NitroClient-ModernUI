import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetAvatarEditorMessage extends RoomWidgetMessage
{
    public static RWCM_OPEN_AVATAR_EDITOR: string = 'RWCM_OPEN_AVATAR_EDITOR';
    public static RWCM_GET_WARDROBE: string = 'RWCM_GET_WARDROBE';
    public static RWAEM_AVATAR_EDITOR_VIEW_DISPOSED: string = 'RWAEM_AVATAR_EDITOR_VIEW_DISPOSED';

    private _context: HTMLElement;

    constructor(k: string, _arg_2: HTMLElement = null)
    {
        super(k);

        this._context = _arg_2;
    }

    public get context(): HTMLElement
    {
        return this._context;
    }
}
