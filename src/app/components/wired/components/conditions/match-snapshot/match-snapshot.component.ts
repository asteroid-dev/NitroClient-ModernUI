import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './match-snapshot.template.html'
})
export class MatchSnapshotComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.STATES_MATCH;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_STATES_MATCH;

    public state: boolean;
    public direction: boolean;
    public position: boolean;

    public get code(): number
    {
        return MatchSnapshotComponent.CODE;
    }

    public get negativeCode(): number
    {
        return MatchSnapshotComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    public get hasStateSnapshot(): boolean
    {
        return true;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.state = trigger.getBoolean(0);
        this.direction = trigger.getBoolean(1);
        this.position = trigger.getBoolean(2);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.state ? 1 : 0, this.direction ? 1 : 0, this.position ? 1 : 0 ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
