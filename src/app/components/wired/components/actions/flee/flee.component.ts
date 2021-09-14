import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './flee.template.html'
})
export class FleeComponent extends WiredAction
{
    public static CODE: number = WiredActionType.FLEE;

    public get code(): number
    {
        return FleeComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
