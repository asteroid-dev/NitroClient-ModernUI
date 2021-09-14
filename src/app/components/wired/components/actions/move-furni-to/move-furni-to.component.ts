import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './move-furni-to.template.html'
})
export class MoveFurniToComponent extends WiredAction
{
    private static SPACING_MINIMUM_VALUE: number = 1;
    private static SPACING_MAXIMUM_VALUE: number = 5;
    private static SPACING_STEPPER_VALUE: number = 1;

    public static CODE: number = WiredActionType.MOVE_FURNI_TO;

    public spacing: number;
    public movement: string;

    public get code(): number
    {
        return MoveFurniToComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.movement = (trigger.intData.length > 0 ? trigger.intData[0] : 0).toString();
        this.spacing = trigger.intData.length > 1 ? trigger.intData[1] : 1;
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.movement), this.spacing ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }

    public decreaseSpacing(): void
    {
        this.spacing -= 1;

        if(this.spacing < MoveFurniToComponent.SPACING_MINIMUM_VALUE) this.spacing = MoveFurniToComponent.SPACING_MINIMUM_VALUE;
    }

    public increaseSpacing(): void
    {
        this.spacing += 1;

        if(this.spacing > MoveFurniToComponent.SPACING_MAXIMUM_VALUE) this.spacing = MoveFurniToComponent.SPACING_MAXIMUM_VALUE;
    }

    public get spacingSliderOptions(): Options
    {
        return {
            floor: MoveFurniToComponent.SPACING_MINIMUM_VALUE,
            ceil: MoveFurniToComponent.SPACING_MAXIMUM_VALUE,
            step: MoveFurniToComponent.SPACING_STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
