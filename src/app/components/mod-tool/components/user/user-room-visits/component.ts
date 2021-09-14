import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RoomVisitData } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ModToolUserInfoService } from '../../../services/mod-tool-user-info.service';
import { ModToolService } from '../../../services/mod-tool.service';
import { ModTool } from '../../tool.component';
import { UserToolUser } from '../user-tool/user-tool-user';


@Component({
    selector: 'nitro-mod-tool-user-visited-rooms-component',
    templateUrl: './template.html'
})
export class ModToolUserVisitedRoomsComponent extends ModTool implements OnInit, OnDestroy
{
    @Input()
    public user: UserToolUser = null;


    constructor(
        private _modToolService: ModToolService,
        private _modToolUserInfoService: ModToolUserInfoService,
        private _navigatorService: NavigatorService
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
        this._modToolService.closeRoomVisitedTool();
    }

    public get roomVisitedForUser(): RoomVisitData[]
    {
        if(!this._modToolService.roomUserVisitedData) return [];

        return this._modToolService.roomUserVisitedData.rooms;
    }

    public showTime(room: RoomVisitData): string
    {
        const a = room.enterHour;
        const b = room.enterMinute;
        return this.prependZero(a) + ':' + this.prependZero(b);
    }

    private prependZero(k: number): string
    {
        return (k < 10) ? `0${k}` : k.toString();
    }

    public goToRoom(room: RoomVisitData): void
    {
        this._navigatorService.goToPrivateRoom(room.roomId);
    }



}
