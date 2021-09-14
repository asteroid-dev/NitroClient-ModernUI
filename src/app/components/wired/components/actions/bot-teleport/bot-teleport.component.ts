import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-teleport.template.html'
})
export class BotTeleportComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_TELEPORT;

    public botName: string;

    public get code(): number
    {
        return BotTeleportComponent.CODE;
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
