import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-talk-direct-to-avatar.template.html'
})
export class BotTalkDirectToAvatarComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_TALK_DIRECT_TO_AVTR;
    private static DELIMETER: string = '\t';

    public botName: string;
    public message: string;
    public mode: string;

    public get code(): number
    {
        return BotTalkDirectToAvatarComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        const stringData = trigger.stringData.split(BotTalkDirectToAvatarComponent.DELIMETER);
        this.botName = stringData.length >= 1 ? stringData[0] : '';
        this.message = stringData.length == 2 ? stringData[1] : '';
        this.mode = trigger.intData.length > 0 ? trigger.intData[0].toString() : '0';
        super.onEditStart(trigger);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    public readStringParamFromForm(): string
    {
        return this.botName + BotTalkDirectToAvatarComponent.DELIMETER + this.message;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.mode) ];
    }
}
