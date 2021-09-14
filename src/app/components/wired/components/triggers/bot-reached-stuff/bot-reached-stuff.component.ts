import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './bot-reached-stuff.template.html'
})
export class BotReachedStuffComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.BOT_REACHED_STUFF;

    public keyword: string = '';

    public get code(): number
    {
        return BotReachedStuffComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.keyword = trigger.stringData;
    }

    public readStringParamFromForm(): string
    {
        return this.keyword;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
