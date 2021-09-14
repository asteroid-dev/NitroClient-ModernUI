import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetRequestWidgetMessage extends RoomWidgetMessage
{
    public static RWRWM_USER_CHOOSER: string = 'RWRWM_USER_CHOOSER';
    public static RWRWM_FURNI_CHOOSER: string = 'RWRWM_FURNI_CHOOSER';
    public static RWRWM_ME_MENU: string = 'RWRWM_ME_MENU';
    public static RWRWM_EFFECTS: string = 'RWRWM_EFFECTS';

    constructor(k: string)
    {
        super(k);
    }
}
