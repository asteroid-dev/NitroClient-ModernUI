import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Nitro, Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './mute-user.template.html'
})
export class MuteUserComponent extends WiredAction
{
    private static LENGTH_MINIMUM_VALUE: number = 1;
    private static LENGTH_MAXIMUM_VALUE: number = 10;
    private static LENGTH_STEPPER_VALUE: number = 1;

    public static CODE: number = WiredActionType.MUTE_USER;

    public message: string;
    public length: number = 0;

    public get code(): number
    {
        return MuteUserComponent.CODE;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public readStringParamFromForm(): string
    {
        return this.message;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.length ];
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.message = trigger.stringData;
        this.length = trigger.intData.length > 0 ? trigger.intData[0] : 10;
        super.onEditStart(trigger);
    }

    public validate(): string
    {
        const messageMaxSize = 100;
        if(this.message.length > messageMaxSize)
        {
            return Nitro.instance.localization.getValue('wiredfurni.chatmsgtoolong', false);
        }
        return null;
    }

    public decreaseLength(): void
    {
        this.length -= 1;

        if(this.length < MuteUserComponent.LENGTH_MINIMUM_VALUE) this.length = MuteUserComponent.LENGTH_MINIMUM_VALUE;
    }

    public increaseLength(): void
    {
        this.length += 1;

        if(this.length > MuteUserComponent.LENGTH_MAXIMUM_VALUE) this.length = MuteUserComponent.LENGTH_MAXIMUM_VALUE;
    }

    public get lengthSliderOptions(): Options
    {
        return {
            floor: MuteUserComponent.LENGTH_MINIMUM_VALUE,
            ceil: MuteUserComponent.LENGTH_MAXIMUM_VALUE,
            step: MuteUserComponent.LENGTH_STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
