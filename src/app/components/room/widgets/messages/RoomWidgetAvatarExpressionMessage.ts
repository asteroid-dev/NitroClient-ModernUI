import { AvatarExpressionEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetMessage } from '../RoomWidgetMessage';

export class RoomWidgetAvatarExpressionMessage extends RoomWidgetMessage
{
    public static RWCM_MESSAGE_AVATAR_EXPRESSION: string = 'RWCM_MESSAGE_AVATAR_EXPRESSION';

    private _animation: AvatarExpressionEnum;

    constructor(k: AvatarExpressionEnum)
    {
        super(RoomWidgetAvatarExpressionMessage.RWCM_MESSAGE_AVATAR_EXPRESSION);

        this._animation = k;
    }

    public get animation(): AvatarExpressionEnum
    {
        return this._animation;
    }
}
