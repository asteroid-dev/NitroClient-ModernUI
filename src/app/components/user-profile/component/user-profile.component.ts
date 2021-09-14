import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendlyTime, GroupInformationParser, Nitro, RelationshipStatusInfo, UserProfileComposer, UserProfileParser } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { SessionService } from '../../../security/services/session.service';
import { UserProfileService } from '../services/user-profile.service';

@Component({
    selector: 'nitro-user-profile-component',
    templateUrl: './user-profile.template.html'
})
export class UserProfileComponent implements OnInit, OnDestroy
{
    private _tabId: number                                              = 0;

    constructor(
        private _userProfileService: UserProfileService,
        private _sessionService: SessionService,
        private _settingsService: SettingsService)
    {}

    public ngOnInit(): void
    {
        this._userProfileService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._userProfileService.component = null;
    }

    public hide(): void
    {
        this._settingsService.hideUserProfile();
    }

    public openRelationshipProfile(relationship: RelationshipStatusInfo): void
    {
        if(!relationship) return;

        Nitro.instance.communication.connection.send(new UserProfileComposer(relationship.randomFriendId));
    }

    public selectGroup(groupId: number): void
    {
        this._userProfileService.selectGroup(groupId);
    }

    public selectTab(tab: number):void
    {
        this._tabId = tab;
    }

    public get visible(): boolean
    {
        return this._settingsService.userProfileVisible;
    }

    public get userProfile(): UserProfileParser
    {
        return this._userProfileService.userLoadedProfile;
    }

    public get userBadges(): string[]
    {
        return this._userProfileService.userBadges;
    }

    public get isMe(): boolean
    {
        if(this.userProfile)
            return this._sessionService.userId === this.userProfile.id;

        return false;
    }

    public get lastLogin(): string
    {
        if(this.userProfile)
            return FriendlyTime.format(this.userProfile.secondsSinceLastVisit, '.ago', 2);

        return '';
    }

    public get isFriend(): boolean
    {
        if(this.userProfile)
            return this.userProfile.isMyFriend;

        return false;
    }

    public get currentRandomHeartRelationship(): RelationshipStatusInfo
    {
        return this._userProfileService.heartRelationships;
    }

    public get currentRandomSmileRelationship(): RelationshipStatusInfo
    {
        return this._userProfileService.smileRelationships;
    }

    public get currentRandomBobbaRelationship(): RelationshipStatusInfo
    {
        return this._userProfileService.bobbaRelationships;
    }

    public get selectedGroup(): GroupInformationParser
    {
        return this._userProfileService.selectedGroup;
    }

    public get tabId(): number
    {
        return this._tabId;
    }
}
 