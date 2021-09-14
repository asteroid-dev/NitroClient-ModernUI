import { Component } from '@angular/core';
import { Nitro, Triggerable } from '@nitrots/nitro-renderer';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './avatar-says-something.template.html'
})
export class AvatarSaysSomethingComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.AVATAR_SAYS_SOMETHING;

    public keyword: string = '';
    public avatar: string = '0';

    public get code(): number
    {
        return AvatarSaysSomethingComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.keyword = (trigger.stringData || '');

        this.avatar = (((trigger.intData.length > 0) && (trigger.intData[0] === 1)) ? '1' : '0');
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ ((this.avatar === '1') ? 1 : 0) ];
    }

    public readStringParamFromForm(): string
    {
        return this.keyword;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get username(): string
    {
        return Nitro.instance.sessionDataManager.userName;
    }
}
