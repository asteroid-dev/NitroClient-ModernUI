import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-is-wearing-effect.template.html'
})
export class ActorIsWearingEffectComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_WEARING_EFFECT;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_WEARING_EFFECT;

    public effectId: string;

    public get code(): number
    {
        return ActorIsWearingEffectComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorIsWearingEffectComponent.NEGATIVE_CODE;
    }

    public readIntegerParamsFromForm(): number[]
    {
        const effectId = parseInt(this.effectId);

        return isNaN(effectId) ? [] : [ effectId ];
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.effectId = trigger.stringData.length > 0 ? trigger.stringData : '0';
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
