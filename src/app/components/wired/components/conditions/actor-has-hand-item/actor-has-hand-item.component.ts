import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-has-hand-item.template.html'
})
export class ActorHasHandItemComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.ACTOR_HAS_HANDITEM;

    public allowedHanditemIds: string[] = ['2', '5', '7', '8', '9', '10', '27'];
    public handitemId: string = '0';

    public get code(): number
    {
        return ActorHasHandItemComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        if((trigger.intData.length > 0) && this.allowedHanditemIds.includes(trigger.intData[0].toString()))
        {
            this.handitemId = trigger.intData[0].toString();
        }
        else
        {
            this.handitemId = '0';
        }
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ parseInt(this.handitemId) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
