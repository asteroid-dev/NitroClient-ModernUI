import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './user-count-in.template.html'
})
export class UserCountInComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.USER_COUNT_IN;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_USER_COUNT_IN;

    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 50;
    private static STEPPER_VALUE: number = 1;

    public minUsers: number = 0;
    public maxUsers: number = 0;

    public get code(): number
    {
        return UserCountInComponent.CODE;
    }

    public get negativeCode(): number
    {
        return UserCountInComponent.NEGATIVE_CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.minUsers = (trigger.intData[0] || 1);
        this.maxUsers = (trigger.intData[1] || 50);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.minUsers, this.maxUsers ];
    }

    public decreaseMin(): void
    {
        this.minUsers -= 1;

        if(this.minUsers < UserCountInComponent.MINIMUM_VALUE) this.minUsers = UserCountInComponent.MINIMUM_VALUE;
    }

    public decreaseMax(): void
    {
        this.maxUsers -= 1;

        if(this.maxUsers < UserCountInComponent.MINIMUM_VALUE) this.maxUsers = UserCountInComponent.MINIMUM_VALUE;
    }

    public increaseMin(): void
    {
        this.minUsers += 1;

        if(this.minUsers > UserCountInComponent.MAXIMUM_VALUE) this.minUsers = UserCountInComponent.MAXIMUM_VALUE;
    }

    public increaseMax(): void
    {
        this.maxUsers += 1;

        if(this.maxUsers > UserCountInComponent.MAXIMUM_VALUE) this.maxUsers = UserCountInComponent.MAXIMUM_VALUE;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: UserCountInComponent.MINIMUM_VALUE,
            ceil: UserCountInComponent.MAXIMUM_VALUE,
            step: UserCountInComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
