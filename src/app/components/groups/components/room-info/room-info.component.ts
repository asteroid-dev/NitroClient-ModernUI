import { Component } from '@angular/core';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-room-info-component',
    templateUrl: './room-info.template.html'
})
export class GroupRoomInfoComponent
{
    private _open: boolean;

    private _groupId: number;
    private _groupName: string;
    private _groupBadgeCode: string;
    private _groupType: number;
    private _groupMembershipType: number;
    private _groupMember: boolean;

    constructor(
        private _groupService: GroupsService)
    {
        this._groupService.groupRoomInfoComponent = this;
        this._open = false;

        this.clear();
    }

    public clear(): void
    {
        this._groupId               = 0;
        this._groupName             = null;
        this._groupBadgeCode        = null;
        this._groupType             = -1;
        this._groupMembershipType   = -1;
        this._groupMember           = false;
    }

    public toggleOpen(): void
    {
        this._open = !this._open;
    }

    public join(): void
    {
        if(!this._groupId || this._groupMembershipType !== 0) return;

        this._groupService.join(this.groupId);
    }

    public openInfo(): void
    {
        this._groupService.getInfo(this._groupId);
    }

    public get visible(): boolean
    {
        return this._groupId > 0;
    }

    public get open(): boolean
    {
        return this._open;
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

    public get isGroupMember(): boolean
    {
        return this._groupMember;
    }

    public set groupMember(value: boolean)
    {
        this._groupMember = value;
    }
}