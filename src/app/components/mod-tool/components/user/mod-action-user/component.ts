import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModtoolEventAlertComposer, ModtoolSanctionAlertComposer, ModtoolSanctionBanComposer, ModtoolSanctionKickComposer, ModtoolSanctionMuteComposer, ModtoolSanctionTradelockComposer, Nitro } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../../../notification/services/notification.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModTool } from '../../tool.component';
import { UserToolUser } from '../user-tool/user-tool-user';
import { ModActionDefinition } from './mod-action-definition';

@Component({
    selector: 'nitro-mod-tool-mod-action-user-component',
    templateUrl: './template.html'
})
export class ModToolModActionUserComponent extends ModTool implements OnInit, OnDestroy
{

    @Input()
    public user: UserToolUser = null;

    public cfhType: string = '-1';
    public sanction: string = '-1';
    public message: string = '';

    private _actions: ModActionDefinition[] = [];

    constructor(
        private _modToolService: ModToolService,
        private _notifications: NotificationService)
    {
        super();

        this._actions = [
            new ModActionDefinition(1, 'Alert', ModActionDefinition.ALERT, 1, 0),
            new ModActionDefinition(2, 'Mute 1h', ModActionDefinition.MUTE, 2, 0),
            new ModActionDefinition(4, 'Ban 7 days', ModActionDefinition.BAN, 4, 0),
            new ModActionDefinition(3, 'Ban 18h', ModActionDefinition.BAN, 3, 0),
            new ModActionDefinition(5, 'Ban 30 days (step 1)', ModActionDefinition.BAN, 5, 0),
            new ModActionDefinition(7, 'Ban 30 days (step 2)', ModActionDefinition.BAN, 7, 0),
            new ModActionDefinition(6, 'Ban 100 years', ModActionDefinition.BAN, 6, 0),
            new ModActionDefinition(106, 'Ban avatar-only 100 years', ModActionDefinition.BAN, 6, 0),
            new ModActionDefinition(101, 'Kick', ModActionDefinition.KICK, 0, 0),
            new ModActionDefinition(102, 'Lock trade 1 week', ModActionDefinition.TRADE_LOCK, 0, 168),
            new ModActionDefinition(104, 'Lock trade permanent', ModActionDefinition.TRADE_LOCK, 0, 876000),
            new ModActionDefinition(105, 'Message', ModActionDefinition.MESSAGE, 0, 0),
        ];
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public sendSanction(): void
    {
        if(this.sanction == '-1')
        {
            this._notifications.alert('Please select a sanction.');
            return;
        }

        if(this.cfhType == '-1')
        {
            this._notifications.alert('Please select a topic.');
            return;
        }

        const category = this.categories[parseInt(this.cfhType)];
        const sanction = this._actions[parseInt(this.sanction)];

        switch(sanction.actionType)
        {
            case ModActionDefinition.ALERT:
                {
                    if(!this._modToolService._Str_3325.alertPermission)
                    {
                        this._notifications.alert('You have insufficient permissions.');
                        return;
                    }
                    Nitro.instance.communication.connection.send(new ModtoolSanctionAlertComposer(this.user.id, this.message, parseInt(this.cfhType)));
                }
                break;
            case ModActionDefinition.MUTE: {
                Nitro.instance.communication.connection.send(new ModtoolSanctionMuteComposer(this.user.id, this.message, parseInt(this.cfhType)));
            }
                break;
            case ModActionDefinition.BAN:
                {
                    if(!this._modToolService._Str_3325.banPermission)
                    {
                        this._notifications.alert('You have insufficient permissions.');
                        return;
                    }

                    Nitro.instance.communication.connection.send(new ModtoolSanctionBanComposer(this.user.id, this.message, parseInt(this.cfhType), parseInt(this.sanction), (sanction.actionId == 106)));
                }
                break;

            case ModActionDefinition.KICK:
                {
                    if(!this._modToolService._Str_3325.kickPermission)
                    {
                        this._notifications.alert('You have insufficient permissions.');
                        return;
                    }

                    Nitro.instance.communication.connection.send(new ModtoolSanctionKickComposer(this.user.id, this.message, parseInt(this.cfhType)));

                }
                break;

            case ModActionDefinition.TRADE_LOCK:
                {
                    const local6 = sanction._Str_25670 * 60;
                    Nitro.instance.communication.connection.send(new ModtoolSanctionTradelockComposer(this.user.id, this.message, local6, parseInt(this.cfhType)));
                }
                break;

            case ModActionDefinition.MESSAGE:
                {
                    if(this.message.trim().length == 0)
                    {
                        this._notifications.alert('Please write a message to user.');
                        return;
                    }

                    Nitro.instance.communication.connection.send(new ModtoolEventAlertComposer(this.user.id, this.message,  parseInt(this.cfhType)));
                }
                break;
        }

        this._modToolService.showModActionOnUser = false;

    }

    public close(): void
    {
        this._modToolService.showModActionOnUser = false;
    }

    public get categories(): string[]
    {
        const categories = this._modToolService.callForHelpCategories;
        const array: string[] = [];

        for(const option of categories)
        {
            for(const item of option.topics)
            {
                array.push(Nitro.instance.localization.getValue('help.cfh.topic.' + item.id));
            }
        }
        return array;
    }

    public get actions(): ModActionDefinition[]
    {
        return this._actions;
    }

}
