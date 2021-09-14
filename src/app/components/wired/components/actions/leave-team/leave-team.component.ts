import { Component } from '@angular/core';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './leave-team.template.html'
})
export class LeaveTeamComponent extends WiredAction
{
    public static CODE: number = WiredActionType.LEAVE_TEAM;

    public get code(): number
    {
        return LeaveTeamComponent.CODE;
    }
}
