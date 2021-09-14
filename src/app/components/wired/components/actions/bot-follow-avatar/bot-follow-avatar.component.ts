import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-follow-avatar.template.html'
})
export class BotFollowAvatarComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_FOLLOW_AVATAR;

    public botName: string;
    public followMode: string = '0';

    public get code(): number
    {
        return BotFollowAvatarComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.botName = trigger.stringData;
        this.followMode = trigger.intData.length > 0 ? trigger.intData[0].toString() : '0';
        super.onEditStart(trigger);
    }

    public readStringParamFromForm(): string
    {
        return this.botName;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.followMode) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
