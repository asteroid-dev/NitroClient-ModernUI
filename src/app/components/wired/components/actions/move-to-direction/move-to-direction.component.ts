import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './move-to-direction.template.html'
})
export class MoveToDirectionComponent extends WiredAction
{
    public static CODE: number = WiredActionType.MOVE_TO_DIRECTION;

    public movement: string;
    public rotation: string;

    public get code(): number
    {
        return MoveToDirectionComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.movement = (trigger.intData.length > 0 ? trigger.intData[0] : 0).toString();
        this.rotation = (trigger.intData.length > 1 ? trigger.intData[1] : 0).toString();
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ Number.parseInt(this.movement), Number.parseInt(this.rotation) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
