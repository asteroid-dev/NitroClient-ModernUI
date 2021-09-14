import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModeratorUserInfoData, ModtoolRequestUserChatlogComposer, ModtoolRequestUserRoomsComposer, Nitro } from '@nitrots/nitro-renderer';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModTool } from '../../tool.component';
import { UserToolUser } from './user-tool-user';

@Component({
    selector: 'nitro-mod-tool-user-component',
    templateUrl: './user-tool.template.html'
})
export class ModToolUserComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService
    )
    {
        super();
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public close(): void
    {
        this._modToolService.closeUserTool();
    }

    public userData(): ModeratorUserInfoData
    {
        return this._modToolUserInfoService.currentUserInfo;
    }

    public get userProperties(): UserInfoOption[]
    {
        const data = this._modToolUserInfoService.currentUserInfo;

        if(!data) return [];

        return [
            {
                nameKey: 'name',
                nameKeyFallback: 'Name',
                value: data.userName
            },
            {
                nameKey: 'cfhs',
                nameKeyFallback: 'CFHs',
                value: data.cfhCount.toString()
            },
            {
                nameKey: 'abusive_cfhs',
                nameKeyFallback: 'Abusive CFHs',
                value:  data.abusiveCfhCount.toString()
            },
            {
                nameKey: 'cautions',
                nameKeyFallback: 'Cautions',
                value: data.cautionCount.toString()
            },
            {
                nameKey: 'bans',
                nameKeyFallback: 'Bans',
                value: data.banCount.toString()
            },
            {
                nameKey: 'last_sanction',
                nameKeyFallback: 'Last sanction',
                value: data.lastSanctionTime
            },
            {
                nameKey: 'trade_locks',
                nameKeyFallback: 'Trade locks',
                value: data.tradingLockCount.toString()
            },
            {
                nameKey: 'lock_expires',
                nameKeyFallback: 'Lock expires',
                value: data.tradingExpiryDate
            },
            {
                nameKey: 'last_login',
                nameKeyFallback: 'Last login',
                value: ModToolUserComponent._Str_12797(data.minutesSinceLastLogin * 60)
            },
            {
                nameKey: 'purchase',
                nameKeyFallback: 'Purchases',
                value: data.lastPurchaseDate
            },
            {
                nameKey: 'email',
                nameKeyFallback: 'Email',
                value: data.primaryEmailAddress
            },
            {
                nameKey: 'acc_bans',
                nameKeyFallback: 'Banned Accs.',
                value: data.identityRelatedBanCount.toString()
            },
            {
                nameKey: 'registered',
                nameKeyFallback: 'Registered',
                value: ModToolUserComponent._Str_12797(data.registrationAgeInMinutes * 60)
            },
            {
                nameKey: 'rank',
                nameKeyFallback: 'Rank',
                value: data.userClassification
            }
        ];
    }


    public handleClick(button: string): void
    {
        switch(button)
        {
            case 'roomchat':
                this._modToolService.showSendUserChatlogs = true;
                Nitro.instance.communication.connection.send(new ModtoolRequestUserChatlogComposer(this.user.id));
                break;
            case 'send_message':
                this._modToolService.showSendUserMessage = true;
                break;
            case 'room_visits':
                this._modToolService.showVisitedRoomsForUser = true;
                Nitro.instance.communication.connection.send(new ModtoolRequestUserRoomsComposer(this.user.id));
                break;
            case 'mod_action':
                this._modToolService.showModActionOnUser = true;
                break;
        }
    }


    public static _Str_12797(k:number):string
    {
        if(k < (2 * 60))
        {
            return k + ' secs ago';
        }
        if(k < (2 * 3600))
        {
            return Math.round((k / 60)) + ' mins ago';
        }
        if(k < (2 * 86400))
        {
            return Math.round((k / 3600)) + ' hours ago';
        }
        if(k < (2 * 31536000))
        {
            return Math.round((k / 86400)) + ' days ago';
        }
        return Math.round((k / 31536000)) + ' years ago';
    }

}

interface UserInfoOption
{
    nameKey: string;
    nameKeyFallback: string;
    value: string;
}
