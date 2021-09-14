import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-talk.template.html'
})
export class BotTalkComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_TALK;
    private static DELIMETER: string = '\t';

    public botName: string;
    public message: string;
    public mode: string;

    public get code(): number
    {
        return BotTalkComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        const stringData = trigger.stringData.split(BotTalkComponent.DELIMETER);
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
        return this.botName + BotTalkComponent.DELIMETER + this.message;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.mode) ];
    }
}
