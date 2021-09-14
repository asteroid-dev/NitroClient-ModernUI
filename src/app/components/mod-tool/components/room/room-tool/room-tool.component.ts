import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModtoolChangeRoomSettingsComposer, ModtoolRequestRoomChatlogComposer, ModtoolRoomAlertComposer, ModtoolRoomInfoParser, Nitro } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { NotificationService } from '../../../../notification/services/notification.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModTool } from '../../tool.component';

@Component({
    selector: 'nitro-mod-tool-room-component',
    templateUrl: './room-tool.template.html'
})
export class ModToolRoomComponent extends ModTool implements OnInit, OnDestroy
{
    public lockDoor: boolean = false;
    public changeTitle: boolean = false;
    public kickUsers: boolean = false;

    public optionId: string = '-1';
    public message: string = '';

    constructor(
        private _modToolService: ModToolService,
        private _navigatorService: NavigatorService,
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
        this._modToolService.showRoomTools = false;
    }

    public send(): void
    {
        if(this.message.trim().length == 0)
        {
            this._notificationService.alert('You must input a message to the user');
            return;
        }

        Nitro.instance.communication.connection.send(new ModtoolRoomAlertComposer(1, this.message, ''));

        if(this.kickUsers || this.changeTitle || this.lockDoor)
        {
            const roomId = this.room.id;
            const lockDoor = this.lockDoor ? 1 : 0;
            const changeTitle = this.changeTitle ? 1 : 0;
            const kickUsers = this.kickUsers ? 1 : 0;
            Nitro.instance.communication.connection.send(new ModtoolChangeRoomSettingsComposer(roomId, lockDoor, changeTitle, kickUsers));
        }

        this._modToolService.showRoomTools = false;
    }

    public isInCurrentRoom(): boolean
    {
        return this._modToolService.currentRoom.roomId == this._modToolService.currentRoomModData.id;
    }

    public enterRoom(): void
    {
        this._navigatorService.goToPrivateRoom(this.room.id);
    }

    public openChatlog(): void
    {
        Nitro.instance.communication.connection.send(new ModtoolRequestRoomChatlogComposer(this.room.id));
        this._modToolService.showRoomChatLogs = true;
    }

    public get room(): ModtoolRoomInfoParser
    {
        return this._modToolService.currentRoomModData;
    }

    public get options(): string[]
    {
        if(!this._modToolService._Str_3325) return [];

        return this._modToolService._Str_3325.roomMessageTemplates;
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


}
