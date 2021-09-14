import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-walks-off-furni.template.html'
})
export class AvatarWalksOffFurniComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_WALKS_OFF_FURNI;

    public get code(): number
    {
        return AvatarWalksOffFurniComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }
}