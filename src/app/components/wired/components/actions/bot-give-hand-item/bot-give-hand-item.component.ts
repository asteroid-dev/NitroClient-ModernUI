import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-give-hand-item.template.html'
})
export class BotGiveHandItemComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_GIVE_HAND_ITEM;

    public botName: string;
    public allowedHanditemIds: string[] = ['2', '5', '7', '8', '9', '10', '27'];
    public handitemId: string = '0';

    public get code(): number
    {
        return BotGiveHandItemComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.botName = trigger.stringData;

        if(trigger.intData.length > 0 && this.allowedHanditemIds.includes(trigger.intData[0].toString()))
        {
            this.handitemId = trigger.intData[0].toString();
        }
        else
        {
            this.handitemId = '0';
        }
        super.onEditStart(trigger);
    }

    public readStringParamFromForm(): string
    {
        return this.botName;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.handitemId) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
