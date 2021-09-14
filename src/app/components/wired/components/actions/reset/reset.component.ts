import { Component } from '@angular/core';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './reset.template.html'
})
export class ResetComponent extends WiredAction
{
    public static CODE: number = WiredActionType.RESET;

    public get code(): number
    {
        return ResetComponent.CODE;
    }
}
