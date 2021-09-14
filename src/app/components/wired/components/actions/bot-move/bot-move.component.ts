import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-move.template.html'
})
export class BotMoveComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_MOVE;

    public botName: string;

    public get code(): number
    {
        return BotMoveComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.botName = trigger.stringData;
        super.onEditStart(trigger);
    }

    public readStringParamFromForm(): string
    {
        return this.botName;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }
}
