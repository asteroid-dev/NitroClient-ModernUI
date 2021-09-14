import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './give-score.template.html'
})
export class GiveScoreComponent extends WiredAction
{
    protected static MINIMUM_VALUE: number = 1;
    protected static STEPPER_VALUE: number = 1;
    protected static POINTS_MAXIMUM_VALUE: number = 100;
    protected static TIMES_MAXIMUM_VALUE: number = 10;

    public static CODE: number = WiredActionType.GIVE_SCORE;

    public points: number = 1;
    public times: number = 1;

    public get code(): number
    {
        return GiveScoreComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.points = trigger.intData.length > 0 ? trigger.intData[0] : 1;
        this.times = trigger.intData.length > 1 ? trigger.intData[1] : 1;
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.points, this.times ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public decreasePoints(): void
    {
        this.points -= 1;

        if(this.points < GiveScoreComponent.MINIMUM_VALUE) this.points = GiveScoreComponent.MINIMUM_VALUE;
    }

    public increasePoints(): void
    {
        this.points += 1;

        if(this.points > GiveScoreComponent.POINTS_MAXIMUM_VALUE) this.points = GiveScoreComponent.POINTS_MAXIMUM_VALUE;
    }

    public decreaseTimes(): void
    {
        this.times -= 1;

        if(this.times < GiveScoreComponent.MINIMUM_VALUE) this.times = GiveScoreComponent.MINIMUM_VALUE;
    }

    public increaseTimes(): void
    {
        this.times += 1;

        if(this.times > GiveScoreComponent.TIMES_MAXIMUM_VALUE) this.times = GiveScoreComponent.TIMES_MAXIMUM_VALUE;
    }

    public get pointsSliderOptions(): Options
    {
        return {
            floor: GiveScoreComponent.MINIMUM_VALUE,
            ceil: GiveScoreComponent.POINTS_MAXIMUM_VALUE,
            step: GiveScoreComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }

    public get timesSliderOptions(): Options
    {
        return {
            floor: GiveScoreComponent.MINIMUM_VALUE,
            ceil: GiveScoreComponent.TIMES_MAXIMUM_VALUE,
            step: GiveScoreComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
