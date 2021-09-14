import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './has-stacked-furnis.template.html'
})
export class HasStackedFurnisComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.HAS_STACKED_FURNIS;
    public requireAll: string = '0';

    public get code(): number
    {
        return HasStackedFurnisComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.requireAll = (((trigger.intData.length > 0) && (trigger.intData[0] === 1)) ? '1' : '0');
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ ((this.requireAll === '1') ? 1 : 0) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
