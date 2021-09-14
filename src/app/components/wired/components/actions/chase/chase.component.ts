import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './chase.template.html'
})
export class ChaseComponent extends WiredAction
{
    public static CODE: number = WiredActionType.CHASE;

    public get code(): number
    {
        return ChaseComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
