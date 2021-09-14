import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Nitro, Triggerable } from '@nitrots/nitro-renderer';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';
import { WiredFurniture } from './../../../WiredFurniture';

@Component({
    templateUrl: './trigger-once.template.html'
})
export class TriggerOnceComponent extends WiredTrigger
{
    protected static MINIMUM_VALUE: number = 1;
    protected static MAXIMUM_VALUE: number = 1200;
    protected static STEPPER_VALUE: number = 1;

    public static CODE: number = WiredTriggerType.TRIGGER_ONCE;

    public time: number         = 0;
    public timeLocale: string   = '';

    public get code(): number
    {
        return TriggerOnceComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.time = (trigger.intData[0] || 1);

        this.updateLocaleParameter();
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.time ];
    }

    public onSliderChange(): void
    {
        this.updateLocaleParameter();
    }

    public decrease(): void
    {
        this.time -= 1;

        if(this.time < TriggerOnceComponent.MINIMUM_VALUE) this.time = TriggerOnceComponent.MINIMUM_VALUE;
    }

    public increase(): void
    {
        this.time += 1;

        if(this.time > TriggerOnceComponent.MAXIMUM_VALUE) this.time = TriggerOnceComponent.MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        this.timeLocale = Nitro.instance.getLocalizationWithParameter('wiredfurni.params.settime', 'seconds', WiredFurniture.getLocaleName(this.time));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: TriggerOnceComponent.MINIMUM_VALUE,
            ceil: TriggerOnceComponent.MAXIMUM_VALUE,
            step: TriggerOnceComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
