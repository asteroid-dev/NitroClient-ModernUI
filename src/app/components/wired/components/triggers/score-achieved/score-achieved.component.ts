import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './score-achieved.template.html'
})
export class ScoreAchievedComponent extends WiredTrigger
{
    private static MINIMUM_VALUE: number = 1;
    private static MAXIMUM_VALUE: number = 1000;
    private static STEPPER_VALUE: number = 1;

    public static CODE: number = WiredTriggerType.SCORE_ACHIEVED;

    public score: number = 0;

    public get code(): number
    {
        return ScoreAchievedComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.score = (trigger.intData[0] || 0);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.score ];
    }

    public decrease(): void
    {
        this.score -= 1;

        if(this.score < ScoreAchievedComponent.MINIMUM_VALUE) this.score = ScoreAchievedComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.score += 1;

        if(this.score > ScoreAchievedComponent.MAXIMUM_VALUE) this.score = ScoreAchievedComponent.MAXIMUM_VALUE;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: ScoreAchievedComponent.MINIMUM_VALUE,
            ceil: ScoreAchievedComponent.MAXIMUM_VALUE,
            step: ScoreAchievedComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
