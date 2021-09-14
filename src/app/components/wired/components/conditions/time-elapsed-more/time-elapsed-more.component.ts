import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { TimeElapsedLessComponent } from '../time-elapsed-less/time-elapsed-less.component';
import { WiredConditionType } from '../WiredConditionType';
import { WiredFurniture } from './../../../WiredFurniture';

@Component({
    templateUrl: './time-elapsed-more.template.html'
})
export class TimeElapsedMoreComponent extends TimeElapsedLessComponent
{
    public static CODE: number = WiredConditionType.TIME_ELAPSED_MORE;

    public get code(): number
    {
        return TimeElapsedMoreComponent.CODE;
    }

    public decrease(): void
    {
        this.time -= 1;

        if(this.time < TimeElapsedMoreComponent.MINIMUM_VALUE) this.time = TimeElapsedMoreComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TimeElapsedMoreComponent.MAXIMUM_VALUE) this.time = TimeElapsedMoreComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        this.timeLocale = Nitro.instance.getLocalizationWithParameter('wiredfurni.params.allowafter', 'seconds', WiredFurniture.getLocaleName(this.time));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TimeElapsedMoreComponent.MINIMUM_VALUE,
            ceil: TimeElapsedMoreComponent.MAXIMUM_VALUE,
            step: TimeElapsedMoreComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
