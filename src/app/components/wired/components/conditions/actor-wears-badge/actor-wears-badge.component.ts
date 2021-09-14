import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-wears-badge.template.html'
})
export class ActorWearsBadgeComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_WEARING_BADGE;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_WEARS_BADGE;

    public botName: string;

    public get code(): number
    {
        return ActorWearsBadgeComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorWearsBadgeComponent.NEGATIVE_CODE;
    }

    public readStringParamFromForm(): string
    {
        return this.botName;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.botName = trigger.stringData;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
