import { Component } from '@angular/core';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './game-starts.template.html'
})
export class GameStartsComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.GAME_STARTS;

    public get code(): number
    {
        return GameStartsComponent.CODE;
    }
}