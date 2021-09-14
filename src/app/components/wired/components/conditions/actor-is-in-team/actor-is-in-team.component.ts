import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-is-in-team.template.html'
})
export class ActorIsInTeamComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_IN_TEAM;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_IN_TEAM;

    public team: string = '1';

    public get code(): number
    {
        return ActorIsInTeamComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorIsInTeamComponent.NEGATIVE_CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.team = trigger.intData[0].toString();
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.team) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
