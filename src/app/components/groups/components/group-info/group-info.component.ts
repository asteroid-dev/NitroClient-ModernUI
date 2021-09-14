import { Component, NgZone } from '@angular/core';
import { GroupRemoveMemberComposer, Nitro } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../../navigator/services/navigator.service';
import { NotificationChoice } from '../../../notification/components/choices/choices.component';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-info-component',
    templateUrl: './group-info.template.html'
})
export class GroupInfoComponent
{
    private _groupId: number;
    private _groupName: string;
    private _groupBadgeCode: string;
    private _groupDescription: string;
    private _groupType: number;
    private _groupMembershipType: number;
    private _groupCreationDate: string;
    private _groupOwnerName: string;
    private _groupMembersCount: number;
    private _groupMembershipRequestsCount: number;
    private _groupHomeRoomId: number;
    private _isOwner: boolean;

    constructor(
        private _ngZone: NgZone,
        private _navigatorService: NavigatorService,
        private _groupService: GroupsService)
    {
        this._groupService.groupInfoComponent = this;

        this.clear();
    }

    public clear(): void
    {
        this._ngZone.run(() =>
        {
            this._groupId                       = 0;
            this._groupName                     = null;
            this._groupBadgeCode                = null;
            this._groupDescription              = null;
            this._groupType                     = -1;
            this._groupMembershipType           = -1;
            this._groupCreationDate             = null;
            this._groupOwnerName                = null;
            this._groupMembersCount             = 0;
            this._groupMembershipRequestsCount  = 0;
            this._groupHomeRoomId               = 0;
            this._isOwner                       = false;
        });
    }

    public goToHomeRoom(): void
    {
        this._navigatorService.goToRoom(this._groupHomeRoomId);
    }

    public manage(): void
    {
        Nitro.instance.createLinkEvent('groups/manage/' + this.groupId);
    }

    public getMembers(pendingRequest: boolean): void
    {
        this._groupService.getMembers(this._groupId, 0, null, pendingRequest ? 2 : 0);
    }

    public join(): void
    {
        if(!this.groupId || this._groupMembershipType !== 0) return;

        this._groupService.join(this.groupId);
    }

    public leave(): void
    {
        if(!this.groupId || this._groupMembershipType !== 1 || this.isOwner) return;

        this._groupService.removeMember(this.groupId, Nitro.instance.sessionDataManager.userId);
    }

    public confirmLeave(): [string, string, NotificationChoice[]]
    {
        const title = Nitro.instance.localization.getValue('group.leaveconfirm.title');
        const message = Nitro.instance.localization.getValue('group.leaveconfirm.desc');

        const choices = [
            new NotificationChoice('group.leave', () =>
            {
                Nitro.instance.communication.connection.send(new GroupRemoveMemberComposer(this.groupId, Nitro.instance.sessionDataManager.userId));
            }, ['btn-danger']),
            new NotificationChoice('generic.close', () =>
            {}, ['btn-primary'])
        ];

        return [title, message, choices];
    }

    public get visible(): boolean
    {
        return (this._groupId > 0);
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set groupId(id: number)
    {
        this._groupId = id;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public set groupName(name: string)
    {
        this._groupName = name;
    }

    public get groupBadgeCode(): string
    {
        return this._groupBadgeCode;
    }

    public set groupBadgeCode(badgeCode: string)
    {
        this._groupBadgeCode = badgeCode;
    }

    public get groupDescription(): string
    {
        return this._groupDescription;
    }

    public set groupDescription(description: string)
    {
        this._groupDescription = description;
    }

    public get groupType(): number
    {
        return this._groupType;
    }

    public set groupType(type: number)
    {
        this._groupType = type;
    }

    public get groupMembershipType(): number
    {
        return this._groupMembershipType;
    }

    public set groupMembershipType(membershipType: number)
    {
        this._groupMembershipType = membershipType;
    }

    public get groupCreationDate(): string
    {
        return this._groupCreationDate;
    }

    public set groupCreationDate(creationDate: string)
    {
        this._groupCreationDate = creationDate;
    }

    public get groupOwnerName(): string
    {
        return this._groupOwnerName;
    }

    public set groupOwnerName(ownerName: string)
    {
        this._groupOwnerName = ownerName;
    }

    public get groupMembersCount(): number
    {
        return this._groupMembersCount;
    }

    public set groupMembersCount(membersCount: number)
    {
        this._groupMembersCount = membersCount;
    }

    public get groupMembershipRequestsCount(): number
    {
        return this._groupMembershipRequestsCount;
    }

    public set groupMembershipRequestsCount(membershipRequestsCount: number)
    {
        this._groupMembershipRequestsCount = membershipRequestsCount;
    }

    public get groupHomeRoomId(): number
    {
        return this._groupHomeRoomId;
    }

    public set groupHomeRoomId(homeRoomId: number)
    {
        this._groupHomeRoomId = homeRoomId;
    }

    public get isOwner(): boolean
    {
        return this._isOwner;
    }

    public set isOwner(isOwner: boolean)
    {
        this._isOwner = isOwner;
    }
}
