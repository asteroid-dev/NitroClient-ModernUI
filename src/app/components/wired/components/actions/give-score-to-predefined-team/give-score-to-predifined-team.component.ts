import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { GiveScoreComponent } from '../give-score/give-score.component';
import { WiredActionType } from '../WiredActionType';

@Component({
    templateUrl: './give-score-to-predefined-team.template.html'
})
export class GiveScoreToPredefinedTeamComponent extends GiveScoreComponent
{
    public static CODE: number = WiredActionType.GIVE_SCORE_TO_PREDEFINED_TEAM;

    public team: string;

    public get code(): number
    {
        return GiveScoreToPredefinedTeamComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.team = (trigger.intData.length > 2 ? trigger.intData[2] : 1).toString();

        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.points, this.times, parseInt(this.team) ];
    }
}
