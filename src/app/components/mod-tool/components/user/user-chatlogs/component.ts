import { Component, Input } from '@angular/core';
import { ModtoolUserChatlogParserVisit } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModToolChatlogsComponent } from '../../shared/chatlogs/component';
import { UserToolUser } from '../user-tool/user-tool-user';


@Component({
    selector: 'nitro-mod-tool-user-chatlogs-component',
    templateUrl: '../../shared/chatlogs/template.html'
})
export class ModToolUserChatlogsComponent extends ModToolChatlogsComponent
{
    @Input()
    public user: UserToolUser;


    constructor(
        protected _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        protected _navigatorService: NavigatorService
    )
    {
        super(_modToolService, _navigatorService);
    }

    public get title(): string
    {
        if(!this.user) return '';

        return `Chatlogs: ${this.user.username}`;
    }

    public getData(): ModtoolUserChatlogParserVisit[]
    {
        if(!this._modToolService.roomVisits) return [];

        return this._modToolService.roomVisits;
    }


    public close(): void
    {
        this._modToolService.showSendUserChatlogs = false;
    }

}
