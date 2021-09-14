import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-enter-room.template.html'
})
export class AvatarEnterRoomComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_ENTERS_ROOM;

    public keyword: string = '';
    public avatar: string = '0';

    public get code(): number
    {
        return AvatarEnterRoomComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.keyword = (trigger.stringData || '');

        this.avatar = ((this.keyword.length > 0) ? '1' : '0');
    }

    public readStringParamFromForm(): string
    {
        return (((this.avatar === '1') && (this.keyword.length > 0)) ? this.keyword : '');
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }
}
