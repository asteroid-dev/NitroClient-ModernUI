import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './set-furni-state-to.template.html'
})
export class SetFurniStateToComponent extends WiredAction
{
    public static CODE: number = WiredActionType.SET_FURNI_STATE;

    public state: boolean;
    public direction: boolean;
    public position: boolean;

    public get code(): number
    {
        return SetFurniStateToComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.state = trigger.getBoolean(0);
        this.direction = trigger.getBoolean(1);
        this.position = trigger.getBoolean(2);
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.state ? 1 : 0, this.direction ? 1 : 0, this.position ? 1 : 0 ];
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    public get hasStateSnapshot(): boolean
    {
        return true;
    }
}
