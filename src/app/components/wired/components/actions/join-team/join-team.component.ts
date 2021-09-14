import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './join-team.template.html'
})
export class JoinTeamComponent extends WiredAction
{
    public static CODE: number = WiredActionType.JOIN_TEAM;

    public team: string;

    public get code(): number
    {
        return JoinTeamComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.team = (trigger.intData.length > 0 ? trigger.intData[0] : 1).toString();
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.team) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
