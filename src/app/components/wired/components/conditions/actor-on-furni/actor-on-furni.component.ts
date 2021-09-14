import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './actor-on-furni.template.html'
})
export class ActorOnFurniComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.TRIGGERER_IS_ON_FURNI;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_ACTOR_ON_FURNI;

    public get code(): number
    {
        return ActorOnFurniComponent.CODE;
    }

    public get negativeCode(): number
    {
        return ActorOnFurniComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }
}