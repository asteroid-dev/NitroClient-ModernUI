import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentFactoryResolver, NgZone, OnDestroy } from '@angular/core';
import { RoomDataParser } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../core/settings/service';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomToolsWidgetHandler } from '../../handlers/RoomToolsWidgetHandler';
import { RoomWidgetZoomToggleMessage } from '../../messages/RoomWidgetZoomToggleMessage';

@Component({
    selector: 'nitro-room-tools-component',
    templateUrl: './main.template.html',
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ transform: 'translateX(-50%)' }),
                        animate('.1s ease-in',
                            style({ transform: 'translateX(0%)' })
                        )
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ transform: 'translateX(0%)' }),
                        animate('.1s ease-out',
                            style({ transform: 'translateX(-50%)' })
                        )
                    ]
                )
            ]
        )
    ]
})
export class RoomToolsMainComponent extends ConversionTrackingWidget implements OnDestroy
{
    private static VISITED_ROOMS: RoomDataParser[]  = [];
    private static MAX_VISIT_HISTORY: number        = 10;

    private _lastRoomId: number = -1;
    private _roomData: RoomDataParser = null;

    private _currentRoomIndex: number = -1;
    private _roomName: string = '';
    private _ownerName: string = '';
    private _tags: string[] = [];
    private _zoomed: boolean = true;

    private _roomOptionsVisible: boolean = false;
    private _roomToolsVisible: boolean = false;

    private _roomOptionsTimeout: ReturnType<typeof setTimeout> = null;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone,
        private _settingsService: SettingsService,
        private _navigatorService: NavigatorService
    )
    {
        super();
    }

    public ngOnDestroy(): void
    {
        this._navigatorService.roomInfoShowing = false;

        this.stopRoomOptionsTimeout();
    }

    public updateRoomInfo(roomData: RoomDataParser): void
    {
        if(!roomData) return;

        this._ngZone.run(() =>
        {
            for(const visited of RoomToolsMainComponent.VISITED_ROOMS)
            {
                if(visited.roomId === roomData.roomId)
                {
                    visited.roomName = roomData.roomName;
                }
            }
        });
    }

    public updateRoomTools(roomName: string, ownerName: string, tags: string[]): void
    {
        this._ngZone.run(() =>
        {
            this._roomName  = roomName;
            this._ownerName = ownerName;
            this._tags      = tags;

            this.showRoomOptions();
        });
    }

    public addVisitedRoom(data: RoomDataParser): void
    {
        this._ngZone.run(() =>
        {
            for(const visited of RoomToolsMainComponent.VISITED_ROOMS)
            {
                if(!visited || (visited.roomId !== data.roomId)) continue;

                return;
            }

            RoomToolsMainComponent.VISITED_ROOMS.push(data);

            if(RoomToolsMainComponent.VISITED_ROOMS.length > RoomToolsMainComponent.MAX_VISIT_HISTORY) RoomToolsMainComponent.VISITED_ROOMS.shift();

            this._currentRoomIndex = (RoomToolsMainComponent.VISITED_ROOMS.length - 1);
        });
    }

    public updateRoomCurrentIndex(roomId: number): void
    {
        this._ngZone.run(() =>
        {
            let i = 0;

            while(i < RoomToolsMainComponent.VISITED_ROOMS.length)
            {
                const roomData = RoomToolsMainComponent.VISITED_ROOMS[i];

                if(roomData && roomData.roomId === roomId)
                {
                    this._currentRoomIndex = i;

                    return;
                }

                i++;
            }
        });
    }

    public likeRoom(): void
    {
        this.handler.rateRoom();
    }

    public hasDirection(direction: number): boolean
    {
        const requestedIndex = (this._currentRoomIndex + direction);

        if((requestedIndex >= 0) && (requestedIndex < RoomToolsMainComponent.VISITED_ROOMS.length)) return true;

        return false;
    }

    public goInDirection(direction: number): void
    {
        const requestedIndex = (this._currentRoomIndex + direction);

        if((requestedIndex < 0) || (requestedIndex > (RoomToolsMainComponent.VISITED_ROOMS.length - 1))) return;

        const roomData = RoomToolsMainComponent.VISITED_ROOMS[requestedIndex];

        if(!roomData) return;

        this._navigatorService.goToPrivateRoom(roomData.roomId);
    }

    public toggleChatHistory(): void
    {
        this._settingsService.toggleChatHistory();
    }

    public toggleZoom(): void
    {
        this.widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage());

        this._zoomed = !this._zoomed;
    }

    public toggleRoomOptions(): void
    {
        this._roomOptionsVisible = !this._roomOptionsVisible;

        if(this._roomOptionsVisible) this.showRoomOptions(false);
    }

    public showRoomOptions(autoHide: boolean = true): void
    {
        this._roomOptionsVisible = true;

        this.stopRoomOptionsTimeout();

        if(autoHide)
        {
            this._roomOptionsTimeout = setTimeout(() =>
            {
                this.stopRoomOptionsTimeout();

                this._roomOptionsVisible = false;
            }, 5000);
        }
    }

    private stopRoomOptionsTimeout(): void
    {
        if(!this._roomOptionsTimeout) return;

        clearTimeout(this._roomOptionsTimeout);

        this._roomOptionsTimeout = null;
    }

    public toggleRoomTools(): void
    {
        this._navigatorService.toggleRoomInfo();
    }

    public get handler(): RoomToolsWidgetHandler
    {
        return (this.widgetHandler as RoomToolsWidgetHandler);
    }

    public get roomName(): string
    {
        return this._roomName;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public get tags(): string[]
    {
        return this._tags;
    }

    public get zoomed(): boolean
    {
        return this._zoomed;
    }

    public get roomOptionsVisible(): boolean
    {
        return this._roomOptionsVisible;
    }

    public get roomToolsVisible(): boolean
    {
        return this._roomToolsVisible;
    }

    public set roomToolsVisible(flag: boolean)
    {
        this._roomToolsVisible = flag;
    }

    public get roomData(): RoomDataParser
    {
        return this._roomData;
    }

    public get canRate(): boolean
    {
        return this._navigatorService.data.canRate;
    }
}
