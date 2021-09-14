import { Component } from '@angular/core';
import { Nitro, RoomControllerLevel, RoomDataParser, RoomMuteComposer, RoomSettingsComposer, RoomStaffPickComposer, SecurityLevel } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { NavigatorData } from '../../common/NavigatorData';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: 'nitro-navigator-room-info-component',
    templateUrl: './room-info.template.html'
})
export class NavigatorRoomInfoComponent
{
    private _thumbnailUrl: string = null;
    private _didRequestUrl: boolean = false;
    constructor(private _navigatorService: NavigatorService,
        private _settingsService: SettingsService)
    {}

    public hide(): void
    {
        this._navigatorService.roomInfoShowing = false;
    }

    public get thumbnail(): string
    {
        if(this._thumbnailUrl) return this._thumbnailUrl;

        if(!this.roomData || this._didRequestUrl) return null;

        let thumbnailUrl = Nitro.instance.core.configuration.getValue<string>('thumbnails.url');

        thumbnailUrl = thumbnailUrl.replace('%thumbnail%', this.roomData.roomId.toString());

        const request = new XMLHttpRequest();

        request.open('GET', thumbnailUrl, true);

        request.onreadystatechange = () =>
        {
            if((request.readyState === 4) && (request.status === 200)) this._thumbnailUrl = thumbnailUrl;
        };

        request.send();

        this._didRequestUrl = true;

        return null;
    }
    

    public handleButton(type: string): void
    {
        if(!type) return;

        switch(type)
        {
            case 'settings':
                this.openRoomSettings();
                return;
            case 'filter':
                return;
            case 'floor-plan':
                this._settingsService.floorPlanVisible = true;
                return;
            case 'staff-pick':
                this.staffPick();
                return;
            case 'room-mute':
                this.muteRoom();
                break;
            case 'report':
                return;
        }
    }

    private openRoomSettings(): void
    {
        Nitro.instance.communication.connection.send(new RoomSettingsComposer(this.roomData.roomId));
    }

    private staffPick(): void
    {
        if(!this.roomData) return;

        this.roomData.roomPicker = !this.roomData.roomPicker;

        Nitro.instance.communication.connection.send(new RoomStaffPickComposer(this.roomData.roomId));
    }

    private muteRoom(): void
    {
        if(!this.roomData) return;

        this.roomData.allInRoomMuted = !this.roomData.allInRoomMuted;

        Nitro.instance.communication.connection.send(new RoomMuteComposer());
    }

    public get data(): NavigatorData
    {
        return this._navigatorService.data;
    }

    public get roomData(): RoomDataParser
    {
        return ((this.data && this.data.enteredGuestRoom) || null);
    }

    public get roomName(): string
    {
        return ((this.roomData && this.roomData.roomName) || '');
    }

    public get ownerName(): string
    {
        return ((this.roomData && this.roomData.ownerName) || '');
    }

    public get showOwner(): boolean
    {
        return (this.roomData && this.roomData.showOwner);
    }

    public get ranking(): number
    {
        return ((this.roomData && this.roomData.ranking) || 0);
    }

    public get roomSettingsVisible(): boolean
    {
        if(!this.roomData) return false;

        return (this.data.currentRoomOwner || (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR));
    }

    public get roomFilterVisible(): boolean
    {
        if(!this.roomData) return false;

        return (this.data.currentRoomOwner || (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.MODERATOR));
    }

    public get floorPlanVisible(): boolean
    {
        if(!this.roomData) return false;

        const session = Nitro.instance.roomSessionManager.getSession(this.roomData.roomId);

        if(!session) return false;

        return session.controllerLevel >= RoomControllerLevel.ROOM_OWNER;
    }

    public get addStaffPickedVisible(): boolean
    {
        if(!this.roomData) return false;

        return (Nitro.instance.sessionDataManager.securityLevel >= SecurityLevel.COMMUNITY);
    }

    public get hoomRegionVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.showOwner;
    }

    public get staffPickVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.roomPicker;
    }

    public get canMuteVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.canMute;
    }

    public get mutedVisible(): boolean
    {
        if(!this.roomData) return false;

        return this.roomData.allInRoomMuted;
    }
}
