import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './toggle-furni.template.html'
})
export class ToggleFurniComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.TOGGLE_FURNI;

    public get code(): number
    {
        return ToggleFurniComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }
}