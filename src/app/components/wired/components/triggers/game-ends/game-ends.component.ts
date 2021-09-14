import { Component } from '@angular/core';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './game-ends.template.html'
})
export class GameEndsComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.GAME_ENDS;

    public get code(): number
    {
        return GameEndsComponent.CODE;
    }
}