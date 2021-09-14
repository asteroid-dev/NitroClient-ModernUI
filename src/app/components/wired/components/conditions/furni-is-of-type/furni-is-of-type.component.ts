import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './furni-is-of-type.template.html'
})
export class FurniIsOfTypeComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.STUFF_TYPE_MATCHES;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_FURNI_IS_OF_TYPE;

    public get code(): number
    {
        return FurniIsOfTypeComponent.CODE;
    }

    public get negativeCode(): number
    {
        return FurniIsOfTypeComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }
}