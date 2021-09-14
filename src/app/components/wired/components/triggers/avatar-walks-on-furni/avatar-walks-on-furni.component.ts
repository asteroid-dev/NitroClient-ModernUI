import { Component } from '@angular/core';
import { WiredMainComponent } from '../../main/main.component';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-walks-on-furni.template.html'
})
export class AvatarWalksOnFurniComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_WALKS_ON_FURNI;

    public get code(): number
    {
        return AvatarWalksOnFurniComponent.CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4991;
    }
}