import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModtoolEventAlertComposer, Nitro } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../../../notification/services/notification.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModTool } from '../../tool.component';
import { UserToolUser } from '../user-tool/user-tool-user';


@Component({
    selector: 'nitro-mod-tool-user-send-message-component',
    templateUrl: './template.html'
})
export class ModToolUserSendMessageComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;

    public optionId: string = '-1';
    public message: string = '';

    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        private _notificationService: NotificationService
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
        this._modToolService.showSendUserMessage = false;
    }

    public get options(): string[]
    {
        if(!this._modToolService._Str_3325) return [];

        return this._modToolService._Str_3325.messageTemplates;
    }

    public selectMessage(id: string)
    {
        if(id == '-1')
        {
            this.message = '';
            return;
        }

        const idNumber = parseInt(id);

        this.message = this.options[idNumber];

    }

    public sendMessage(): void
    {
        if(this.message.trim().length == 0)
        {
            this._notificationService.alert('Please enter a message');
            return;
        }

        Nitro.instance.communication.connection.send(new ModtoolEventAlertComposer(this.user.id, this.message, -999));
        this._modToolService.showSendUserMessage = false;
    }


}
