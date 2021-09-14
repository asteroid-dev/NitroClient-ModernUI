import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, ILinkEventTracker, IMessageEvent, Nitro, RelationshipStatusEnum, RelationshipStatusInfo, RelationshipStatusInfoEvent, RoomEngineObjectEvent, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileComposer, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { UserProfileComponent } from '../component/user-profile.component';

@Injectable()
export class UserProfileService implements OnDestroy, ILinkEventTracker
{
    private _component: UserProfileComponent;
    private _messages: IMessageEvent[];
    private _userLoadedProfile: UserProfileParser;
    private _userBadges: string[];
    private _heartRelationships: RelationshipStatusInfo;
    private _smileRelationships: RelationshipStatusInfo;
    private _bobbaRelationships: RelationshipStatusInfo;
    private _selectedGroup: GroupInformationParser;

    constructor(
        private _ngZone: NgZone,
        private _settingsService: SettingsService)
    {
        this.onRoomEngineObjectEvent = this.onRoomEngineObjectEvent.bind(this);

        this.flush();
        this.registerMessages();

        Nitro.instance.addLinkEventTracker(this);
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.removeLinkEventTracker(this);

        this.unregisterMessages();
    }

    private flush(): void
    {
        this._userLoadedProfile  = null;
        this._userBadges         = [];
        this._heartRelationships = null;
        this._smileRelationships = null;
        this._bobbaRelationships = null;
        this._selectedGroup      = null;
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);

            this._messages = [
                new UserProfileEvent(this.onUserProfileEvent.bind(this)),
                new UserCurrentBadgesEvent(this.onUserCurrentBadgesEvent.bind(this)),
                new RelationshipStatusInfoEvent(this.onUserRelationshipsEvent.bind(this)),
                new GroupInformationEvent(this.onGroupInformationEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);

            if(this._messages && this._messages.length) for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                return;
        }
    }

    private onUserProfileEvent(event: UserProfileEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this.flush();

            this._userLoadedProfile = parser;

            Nitro.instance.communication.connection.send(new UserCurrentBadgesComposer(this._userLoadedProfile.id));
            Nitro.instance.communication.connection.send(new UserRelationshipsComposer(this._userLoadedProfile.id));

            if(parser.groups.length > 0) Nitro.instance.communication.connection.send(new GroupInformationComposer(this._userLoadedProfile.groups[0].id, false));

            this._settingsService.showUserProfile();
        });
    }

    private onUserCurrentBadgesEvent(event: UserCurrentBadgesEvent): void
    {
        if(!event || !this._userLoadedProfile) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.userId !== this._userLoadedProfile.id) return;

        this._ngZone.run(() => (this._userBadges = parser.badges));
    }

    private onUserRelationshipsEvent(event: RelationshipStatusInfoEvent): void
    {
        if(!event || !this._userLoadedProfile) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.userId !== this._userLoadedProfile.id) return;

        this._ngZone.run(() =>
        {
            this._heartRelationships = parser.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART);
            this._smileRelationships = parser.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE);
            this._bobbaRelationships = parser.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA);
        });
    }

    public onGroupInformationEvent(event: GroupInformationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._selectedGroup && parser.id !== this._selectedGroup.id) return;

        this._ngZone.run(() => (this._selectedGroup = parser));
    }

    public selectGroup(groupId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupInformationComposer(groupId, false));
    }

    public loadUserProfile(userId: number): void
    {
        Nitro.instance.communication.connection.send(new UserProfileComposer(userId));
    }

    public linkReceived(k: string):void
    {
        const parts = k.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'goto':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        default: {
                            const userId = parseInt(parts[2]);

                            if(userId > 0) this.loadUserProfile(userId);
                        }
                    }
                }
                return;
        }
    }

    public get eventUrlPrefix(): string
    {
        return 'profile';
    }

    public set component(component: UserProfileComponent)
    {
        this._component = component;
    }

    public get userLoadedProfile(): UserProfileParser
    {
        return this._userLoadedProfile;
    }

    public get userBadges(): string[]
    {
        return this._userBadges;
    }

    public get heartRelationships(): RelationshipStatusInfo
    {
        return this._heartRelationships;
    }

    public get smileRelationships(): RelationshipStatusInfo
    {
        return this._smileRelationships;
    }

    public get bobbaRelationships(): RelationshipStatusInfo
    {
        return this._bobbaRelationships;
    }

    public get selectedGroup(): GroupInformationParser
    {
        return this._selectedGroup;
    }
}
