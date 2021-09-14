import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './furni-have-habbo.template.html'
})
export class FurniHaveHabboComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.FURNIS_HAVE_AVATARS;
    public static NEGATIVE_CODE: number = WiredConditionType.FURNI_NOT_HAVE_HABBO;

    public get code(): number
    {
        return FurniHaveHabboComponent.CODE;
    }

    public get negativeCode(): number
    {
        return FurniHaveHabboComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }
}