import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './teleport.template.html'
})
export class TeleportComponent extends WiredAction
{
    public static CODE: number = WiredActionType.TELEPORT;

    public get code(): number
    {
        return TeleportComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5430;
    }
}
