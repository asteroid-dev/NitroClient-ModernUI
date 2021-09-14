import { Component, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, NavigatorCategoryDataParser, Nitro, RoomBannedUsersComposer, RoomBannedUsersEvent, RoomDeleteComposer, RoomGiveRightsComposer, RoomSettingsEvent, RoomTakeRightsComposer, RoomUnbanUserComposer, RoomUsersWithRightsComposer, RoomUsersWithRightsEvent, SaveRoomSettingsComposer } from '@nitrots/nitro-renderer';
import { MessengerFriend } from '../../../friendlist/common/MessengerFriend';
import { FriendListService } from '../../../friendlist/services/friendlist.service';
import { NotificationChoice } from '../../../notification/components/choices/choices.component';
import { NotificationService } from '../../../notification/services/notification.service';
import { NavigatorService } from '../../services/navigator.service';
import RoomSettings from './common/RoomSettings';


@Component({
    selector: 'nitro-navigator-roomsettings-component',
    templateUrl: './roomsettings.template.html'
})
export class NavigatorRoomSettingsComponent implements OnDestroy
{

    private _currentTab: number = 1;
    private _messages: IMessageEvent[] = [];
    private _maxVisitors: number[] = [];

    public roomSettings: RoomSettings;

    private _roomId: number;
    private _oldRoomName: string;
    private _oldLockState: string;
    private _visible: boolean;

    constructor(
        private _navigatorService: NavigatorService,
        private _friendListService: FriendListService,
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this.onRoomSettingsEvent         = this.onRoomSettingsEvent.bind(this);
        this.onRoomUsersWithRightsEvent  = this.onRoomUsersWithRightsEvent.bind(this);
        this.onRoomBannedUsersEvent      = this.onRoomBannedUsersEvent.bind(this);

        this.clear();
        this.registerMessages();
    }

    private clear(): void
    {
        this._currentTab     = 1;

        this.roomSettings    = new RoomSettings(this._ngZone);

        this._roomId         = 0;
        this._oldRoomName    = null;
        this._visible        = false;
    }

    public ngOnDestroy(): void
    {
        this.clear();
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new RoomSettingsEvent(this.onRoomSettingsEvent),
                new RoomUsersWithRightsEvent(this.onRoomUsersWithRightsEvent),
                new RoomBannedUsersEvent(this.onRoomBannedUsersEvent)
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSettingsEvent(event: RoomSettingsEvent): void
    {
        if(!(event instanceof RoomSettingsEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.clear();

        this._roomId = parser.roomId;

        this._ngZone.run(() =>
        {
            this.roomSettings.roomName               = parser.name;
            this.roomSettings.roomDescription        = parser.description;
            this.roomSettings.categoryId             = parser.categoryId.toString();
            this.roomSettings.userCount              = parser.userCount.toString();
            this.roomSettings.tradeState             = parser.tradeMode.toString();
            this.roomSettings.allowWalkthrough       = parser.allowWalkthrough;

            this.roomSettings.lockState              = parser.state.toString();
            this.roomSettings.allowPets              = parser.allowPets;

            this.roomSettings.hideWalls              = parser.hideWalls;
            this.roomSettings.wallThickness          = parser.thicknessWall.toString();
            this.roomSettings.floorThickness         = parser.thicknessFloor.toString();
            this.roomSettings.chatBubbleMode         = parser.chatSettings.mode.toString();
            this.roomSettings.chatBubbleWeight       = parser.chatSettings.weight.toString();
            this.roomSettings.chatBubbleSpeed        = parser.chatSettings.speed.toString();
            this.roomSettings.chatFloodProtection    = parser.chatSettings.protection.toString();
            this.roomSettings.chatDistance           = parser.chatSettings.distance;

            this.roomSettings.muteState              = parser.moderationSettings.allowMute.toString();
            this.roomSettings.kickState              = parser.moderationSettings.allowKick.toString();
            this.roomSettings.banState               = parser.moderationSettings.allowBan.toString();

            this._maxVisitors           = this._navigatorService.getMaxVisitors(50);

            this._oldRoomName           = parser.name;
            this._oldLockState          = parser.state.toString();
            this._visible               = true;
        });

        Nitro.instance.communication.connection.send(new RoomUsersWithRightsComposer(this._roomId));
        Nitro.instance.communication.connection.send(new RoomBannedUsersComposer(this._roomId));
    }

    private onRoomUsersWithRightsEvent(event: RoomUsersWithRightsEvent)
    {
        if(!(event instanceof RoomUsersWithRightsEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.roomSettings.usersWithRights = new Map(parser.users);
        this.getFriendsWithoutRights();
    }

    private onRoomBannedUsersEvent(event: RoomBannedUsersEvent)
    {
        if(!(event instanceof RoomBannedUsersEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.roomSettings.bannedUsers = new Map(parser.users);
    }

    public getFriendsWithoutRights(): void
    {
        this._friendListService.friends.forEach((friend: MessengerFriend, id: number) =>
        {
            if(!this.roomSettings.usersWithRights.has(id))
            {
                this.roomSettings.friendsWithoutRights.set(id, friend.name);
            }
        });
    }

    public changeTab(tab: number): void
    {
        this._currentTab = tab;
    }

    public onDeleteRoom(): void
    {
        const title = Nitro.instance.localization.getValue('navigator.roomsettings.deleteroom.confirm.title');
        const message = Nitro.instance.localization.getValueWithParameter('navigator.roomsettings.deleteroom.confirm.message', 'room_name', '<b>' + this.roomSettings.roomName + '</b>');

        const choices = [
            new NotificationChoice('navigator.roomsettings.delete', () =>
            {

                Nitro.instance.communication.connection.send(new RoomDeleteComposer(this._roomId));
                this.hide();

            }, ['btn-danger']),
            new NotificationChoice('generic.close', () =>
            {}, ['btn-primary'])
        ];

        this._notificationService.alertWithChoices(message, choices, title);
    }

    public onOpenProfile(userId: number): void
    {
        //Nitro.instance.communication.connection.send(new UserProfileByIdComposer(userId));
    }

    public onGiveRights(userId: number): void
    {
        if(!this.roomSettings.friendsWithoutRights.has(userId)) return;

        this._ngZone.run(() =>
        {
            this.roomSettings.usersWithRights.set(userId, this.roomSettings.friendsWithoutRights.get(userId));
            this.roomSettings.friendsWithoutRights.delete(userId);
        });

        Nitro.instance.communication.connection.send(new RoomGiveRightsComposer(userId));
    }

    public onTakeRights(userId: number): void
    {
        if(!this.roomSettings.usersWithRights.has(userId)) return;

        this._ngZone.run(() =>
        {
            this.roomSettings.friendsWithoutRights.set(userId, this.roomSettings.usersWithRights.get(userId));
            this.roomSettings.usersWithRights.delete(userId);
        });

        Nitro.instance.communication.connection.send(new RoomTakeRightsComposer(userId));
    }

    public onUnban(): void
    {
        if(this.roomSettings.selectedUserToUnban === 0) return;

        if(!this.roomSettings.bannedUsers.has(this.roomSettings.selectedUserToUnban)) return;

        const userId = this.roomSettings.selectedUserToUnban;

        this._ngZone.run(() =>
        {
            this.roomSettings.bannedUsers.delete(this.roomSettings.selectedUserToUnban);
            this.roomSettings.selectedUserToUnban = 0;
        });

        Nitro.instance.communication.connection.send(new RoomUnbanUserComposer(userId, this._roomId));
    }

    public hide(): void
    {
        this._visible = false;
        this.clear();
    }

    public onSave(roomSettings: RoomSettings): void
    {
        this._ngZone.run(() =>
        {
            this.roomSettings = roomSettings;
        });

        let lockState = roomSettings.lockState;
        let password = roomSettings.password;

        if(!roomSettings.isValidPassword)
        {
            lockState = this._oldLockState;
            password = null;
        }
        else
        {
            this._oldLockState = lockState;
        }

        if(roomSettings.roomName.length < 1)
            roomSettings.roomName = this._oldRoomName;

        if(parseInt(roomSettings.userCount) < 0)
            roomSettings.userCount = '10';

        const event = new SaveRoomSettingsComposer(
            this._roomId,
            roomSettings.roomName,
            roomSettings.roomDescription,
            parseInt(lockState),
            password,
            parseInt(roomSettings.userCount),
            parseInt(roomSettings.categoryId),
            roomSettings.tags.length,
            roomSettings.tags,
            parseInt(roomSettings.tradeState),
            roomSettings.allowPets,
            roomSettings.allowPetsEat,
            roomSettings.allowWalkthrough,
            roomSettings.hideWalls,
            parseInt(roomSettings.wallThickness),
            parseInt(roomSettings.floorThickness),
            parseInt(roomSettings.muteState),
            parseInt(roomSettings.kickState),
            parseInt(roomSettings.banState),
            parseInt(roomSettings.chatBubbleMode),
            parseInt(roomSettings.chatBubbleWeight),
            parseInt(roomSettings.chatBubbleSpeed),
            roomSettings.chatDistance,
            parseInt(roomSettings.chatFloodProtection)
        );

        Nitro.instance.communication.connection.send(event);
    }

    public get currentTab(): number
    {
        return this._currentTab;
    }

    public get categories(): NavigatorCategoryDataParser[]
    {
        return this._navigatorService.categories;
    }

    public get maxVisitors(): number[]
    {
        return this._maxVisitors;
    }

    public get tradeSettings(): string[]
    {
        return this._navigatorService.tradeSettings;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public get usersWithRights(): Map<number, string>
    {
        return this.roomSettings.usersWithRights;
    }
}
