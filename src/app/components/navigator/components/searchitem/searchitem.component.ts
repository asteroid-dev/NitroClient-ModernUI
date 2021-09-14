import { Component, Input, NgZone } from '@angular/core';
import { Nitro, RoomDataParser } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-search-result-item-component]',
    templateUrl: './searchitem.template.html'
})
export class NavigatorSearchItemComponent
{
    @Input()
    public room: RoomDataParser;

    @Input()
    public displayMode: number;

    private _thumbnailUrl: string = null;
    private _didRequestUrl: boolean = false;

    constructor(
        private _navigatorService: NavigatorService,
        private _ngZone: NgZone)
    {}

    public visit(): void
    {
        if(this.room.ownerId !== Nitro.instance.sessionDataManager.userId)
        {
            if(this.room.habboGroupId !== 0)
            {
                this._navigatorService.goToPrivateRoom(this.room.roomId);

                return;
            }

            switch(this.room.doorMode)
            {
                case RoomDataParser.DOORBELL_STATE:
                    this._navigatorService.openRoomDoorbell(this.room);
                    return;
                case RoomDataParser.PASSWORD_STATE:
                    this._navigatorService.openRoomPassword(this.room);
                    return;
            }
        }

        this._navigatorService.goToRoom(this.room.roomId);
    }

    public get isGroup(): boolean
    {
        return (this.room && (this.room.habboGroupId > 0));
    }

    public get isDoorbell(): boolean
    {
        return (this.room && (this.room.doorMode === RoomDataParser.DOORBELL_STATE));
    }

    public get isPassword(): boolean
    {
        return (this.room && (this.room.doorMode === RoomDataParser.PASSWORD_STATE));
    }

    public get thumbnail(): string
    {
        if(this._thumbnailUrl) return this._thumbnailUrl;

        if(!this.room || this._didRequestUrl) return null;

        let thumbnailUrl = Nitro.instance.core.configuration.getValue<string>('thumbnails.url');

        thumbnailUrl = thumbnailUrl.replace('%thumbnail%', this.room.roomId.toString());

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

    public get entryBg(): string
    {
        const num: number = (100 * (this.room.userCount / this.room.maxUserCount));

        let bg = 'roomGray';

        if(num >= 92)
        {
            bg = 'roomRed';
        }
        else if(num >= 50)
        {
            bg = 'roomOrange';
        }
        else if(num > 0)
        {
            bg = 'roomGreen';
        }


        return bg;
    }

    public get entryBg2(): string
    {
        const num: number = (100 * (this.room.userCount / this.room.maxUserCount));

        let bg = 'roomGray2';

        if(num >= 92)
        {
            bg = 'roomRed2';
        }
        else if(num >= 50)
        {
            bg = 'roomOrange2';
        }
        else if(num > 0)
        {
            bg = 'roomGreen2';
        }


        return bg;
    }
}
