import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { TriggerOnceComponent } from '../trigger-once/trigger-once.component';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './trigger-periodically.template.html'
})
export class TriggerPeriodicallyComponent extends TriggerOnceComponent
{
    protected static MAXIMUM_VALUE: number = 120;

    public static CODE: number = WiredTriggerType.TRIGGER_PERIODICALLY;

    public get code(): number
    {
        return TriggerPeriodicallyComponent.CODE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TriggerPeriodicallyComponent.MAXIMUM_VALUE) this.time = TriggerPeriodicallyComponent.MAXIMUM_VALUE;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TriggerPeriodicallyComponent.MINIMUM_VALUE,
            ceil: TriggerPeriodicallyComponent.MAXIMUM_VALUE,
            step: TriggerPeriodicallyComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
