import { Component } from '@angular/core';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-is-in-group.template.html'
})
export class ActorIsInGroupComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.ACTOR_IS_GROUP_MEMBER;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_IN_GROUP;

    public get code(): number
    {
        return ActorIsInGroupComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorIsInGroupComponent.NEGATIVE_CODE;
    }
}